export interface AuthorProfile {
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

/** Tag shape returned by public API (matches Prisma Tag select). */
export interface TagPayload {
  id: string;
  name: string;
  label: string;
  color: string;
}

/** Feed blog row shape (matches Prisma findMany select). */
export interface FeedBlogRow {
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
export interface BlogBySlugRow extends FeedBlogRow {
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
export interface FeedBlogRow {
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
export interface BlogBySlugRow extends FeedBlogRow {
  content: string;
  updatedAt: Date;
  isPublished: boolean;
}

export interface AuthorProfile {
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

export interface AuthorProfileUserRow {
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
