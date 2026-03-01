import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { UserBlogsQueryDto } from './dto/user-blogs-query.dto';

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

interface AuthorProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  joinedAt: Date;
  stats: {
    publishedBlogs: number;
    totalLikes: number;
    totalComments: number;
  };
}

interface AuthorProfileUserRow {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  createdAt: Date;
  _count: {
    blogs: number;
    likes: number;
  };
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

    const tags = (await this.prisma.tag.findMany({
      orderBy: { label: 'asc' },
      select: { id: true, name: true, label: true, color: true },
    })) as TagPayload[];

    return tags;
  }
  async getAuthorProfile(username: string): Promise<AuthorProfile> {
    const rawUser = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            blogs: { where: { isPublished: true } },
            likes: true,
          },
        },
      },
    });

    const user = rawUser as AuthorProfileUserRow | null;

    if (!user) throw new NotFoundException('Author not found');

    // Total likes received on all their published blogs
    const totalLikesReceived = await this.prisma.like.count({
      where: { blog: { userId: user.id, isPublished: true } },
    });

    // Total comments received
    const totalCommentsReceived = await this.prisma.comment.count({
      where: { blog: { userId: user.id, isPublished: true } },
    });

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      joinedAt: user.createdAt,
      stats: {
        publishedBlogs: user._count.blogs,
        totalLikes: totalLikesReceived,
        totalComments: totalCommentsReceived,
      },
    };
  }

  async getAuthorBlogs(username: string, query: UserBlogsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 9;
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('Author not found');

    const where = { userId: user.id, isPublished: true };

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

    return {
      data: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        publishedAt: blog.createdAt,
        author: blog.user,
        likeCount: blog._count.likes,
        commentCount: blog._count.comments,
        tags: blog.tags.map((bt) => bt.tag),
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
}
