import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateSlug, generateUniqueSlug } from '../common/utils/slug.util';
import { QUEUES, BLOG_JOBS } from '../common/constants/queue.constants';
import type { GenerateSummaryJobData } from '../jobs/types/blog-job.types';

@Injectable()
export class BlogsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUES.BLOG) private readonly blogQueue: Queue,
  ) {}

  async create(userId: string, dto: CreateBlogDto) {
    const baseSlug = generateSlug(dto.title);

    const existing = await this.prisma.blog.findUnique({
      where: { slug: baseSlug },
    });

    const slug = existing
      ? generateUniqueSlug(dto.title, Date.now().toString(36))
      : baseSlug;

    const blog = await this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        slug,
        content: dto.content,
        isPublished: dto.isPublished ?? false,
        // Connect tags if provided
        ...(dto.tagIds?.length && {
          tags: {
            create: dto.tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        summary: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, username: true } },
        tags: {
          select: {
            tag: { select: { id: true, name: true, label: true, color: true } },
          },
        },
      },
    });

    // Enqueue summary job if published on creation
    if (blog.isPublished && !blog.summary) {
      await this.enqueueSummaryJob(blog.id, blog.title, blog.content);
    }

    return blog;
  }

  async findAllByUser(userId: string) {
    return this.prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        slug: true,
        content: true,
        summary: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException('Access denied');

    return blog;
  }

  async update(id: string, userId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId)
      throw new ForbiddenException('You can only edit your own blogs');

    let slug = blog.slug;
    if (dto.title && dto.title !== blog.title) {
      const newBase = generateSlug(dto.title);
      const conflict = await this.prisma.blog.findFirst({
        where: { slug: newBase, NOT: { id } },
      });
      slug = conflict
        ? generateUniqueSlug(dto.title, Date.now().toString(36))
        : newBase;
    }

    const updated = await this.prisma.blog.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title, slug }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
        // Replace tags completely if provided
        ...(dto.tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: dto.tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        summary: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: { select: { id: true, name: true, label: true, color: true } },
          },
        },
      },
    });

    // Enqueue summary job when blog is being published for first time
    const isBeingPublished = dto.isPublished === true && !blog.isPublished;
    const contentChanged =
      dto.content !== undefined && dto.content !== blog.content;
    const needsSummary = !updated.summary || contentChanged;

    if (
      (isBeingPublished || (updated.isPublished && contentChanged)) &&
      needsSummary
    ) {
      await this.enqueueSummaryJob(updated.id, updated.title, updated.content);
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId)
      throw new ForbiddenException('You can only delete your own blogs');

    await this.prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }

  // --- Like System ---

  async likeBlog(blogId: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    try {
      await this.prisma.like.create({ data: { userId, blogId } });
    } catch {
      throw new ConflictException('You have already liked this blog');
    }

    const likeCount = await this.prisma.like.count({ where: { blogId } });
    return { liked: true, likeCount };
  }

  async unlikeBlog(blogId: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    const like = await this.prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });

    if (!like) throw new NotFoundException('You have not liked this blog');

    await this.prisma.like.delete({
      where: { userId_blogId: { userId, blogId } },
    });

    const likeCount = await this.prisma.like.count({ where: { blogId } });
    return { liked: false, likeCount };
  }

  // --- Comment System ---

  async addComment(blogId: string, userId: string, content: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    return this.prisma.comment.create({
      data: { blogId, userId, content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, username: true } },
      },
    });
  }

  async getComments(blogId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    return this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, username: true } },
      },
    });
  }

  // --- Private Helpers ---

  private async enqueueSummaryJob(
    blogId: string,
    title: string,
    content: string,
  ): Promise<void> {
    const jobData: GenerateSummaryJobData = { blogId, title, content };
    await this.blogQueue.add(BLOG_JOBS.GENERATE_SUMMARY, jobData, {
      jobId: `summary-${blogId}`, // deduplicate: same blog won't queue twice
      delay: 1000, // slight delay to let the DB write settle
    });
  }
}
