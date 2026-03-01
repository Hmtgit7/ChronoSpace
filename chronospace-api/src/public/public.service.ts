import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedQueryDto } from './dto/feed-query.dto';

/** Tag shape returned by public API (matches Prisma Tag select). */
export interface TagPayload {
  id: string;
  name: string;
  label: string;
  color: string;
}

/** Feed blog row shape (matches Prisma findMany select). */
interface FeedBlogRow {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  createdAt: Date;
  user: { id: string; username: string };
  _count: { likes: number; comments: number };
  tags: Array<{ tag: TagPayload }>;
}

/** Blog-by-slug row shape (matches Prisma findUnique select). */
interface BlogBySlugRow extends FeedBlogRow {
  content: string;
  updatedAt: Date;
  isPublished: boolean;
}

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(query: FeedQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 9;
    const skip = (page - 1) * limit;
    const sort = query.sort ?? 'latest';
    const tagFilter = query.tag;

    // Build where clause
    const where: object = {
      isPublished: true,
      ...(tagFilter && {
        tags: {
          some: {
            tag: { name: tagFilter },
          },
        },
      }),
    };

    // Trending = most likes in last 7 days
    // Latest = newest first
    const orderBy =
      sort === 'trending'
        ? { likes: { _count: 'desc' as const } }
        : { createdAt: 'desc' as const };

    const [rawBlogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        orderBy,
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
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, label: true, color: true },
              },
            },
          },
        },
      }),
      this.prisma.blog.count({ where }),
    ]);
    const blogs = rawBlogs as FeedBlogRow[];

    return {
      data: blogs.map((blog) => {
        const tags: TagPayload[] = blog.tags.map((bt) => bt.tag);
        return {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          summary: blog.summary,
          publishedAt: blog.createdAt,
          author: blog.user,
          likeCount: blog._count.likes,
          commentCount: blog._count.comments,
          tags,
        };
      }),
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
    const rawBlog = await this.prisma.blog.findUnique({
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
        tags: {
          select: {
            tag: { select: { id: true, name: true, label: true, color: true } },
          },
        },
      },
    });

    const blog = rawBlog as BlogBySlugRow | null;
    if (!blog || !blog.isPublished)
      throw new NotFoundException('Blog not found');

    const tags: TagPayload[] = blog.tags.map((bt) => bt.tag);
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
      tags,
    };
  }

  async getAllTags(): Promise<TagPayload[]> {
    // Prisma client may be unresolved when generated output is not in scope
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const tags = (await this.prisma.tag.findMany({
      orderBy: { label: 'asc' },
      select: { id: true, name: true, label: true, color: true },
    })) as TagPayload[];
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    return tags;
  }
}
