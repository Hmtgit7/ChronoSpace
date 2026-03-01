import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedQueryDto } from './dto/feed-query.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(query: FeedQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 9;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where = {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { summary: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          createdAt: true,
          user: { select: { id: true, username: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      data: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        publishedAt: blog.createdAt,
        author: blog.user, // ✅ Fixed: was 'user', now 'author' to match FeedBlog type
        likeCount: blog._count.likes,
        commentCount: blog._count.comments,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async getBlogBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
        isPublished: true,
        user: { select: { id: true, username: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!blog || !blog.isPublished) {
      throw new NotFoundException('Blog not found');
    }

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      summary: blog.summary,
      publishedAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      user: blog.user,
      likeCount: blog._count.likes,
      commentCount: blog._count.comments,
      _count: blog._count,
    };
  }
}
