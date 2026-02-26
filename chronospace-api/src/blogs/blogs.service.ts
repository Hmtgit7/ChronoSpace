import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateSlug, generateUniqueSlug } from '../common/utils/slug.util';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBlogDto) {
    const baseSlug = generateSlug(dto.title);

    // Check slug uniqueness; append short uid suffix on collision
    const existing = await this.prisma.blog.findUnique({
      where: { slug: baseSlug },
    });

    const slug = existing
      ? generateUniqueSlug(dto.title, Date.now().toString(36))
      : baseSlug;

    return this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        slug,
        content: dto.content,
        isPublished: dto.isPublished ?? false,
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
        user: {
          select: { id: true, username: true },
        },
      },
    });
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
        _count: {
          select: { likes: true, comments: true },
        },
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
        _count: {
          select: { likes: true, comments: true },
        },
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

    // Handle slug regeneration if title changed
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

    return this.prisma.blog.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title, slug }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
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
      },
    });
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
        user: {
          select: { id: true, username: true },
        },
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
        user: {
          select: { id: true, username: true },
        },
      },
    });
  }
}
