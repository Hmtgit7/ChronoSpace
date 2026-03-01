// ─── Auth ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Blog ────────────────────────────────────────────────────────
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  user?: Pick<User, "id" | "username">;
  tags: Tag[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  isPublished?: boolean;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  isPublished?: boolean;
}

// ─── Feed ────────────────────────────────────────────────────────
export interface FeedBlog {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: string;
  author: Pick<User, "id" | "username">;
  likeCount: number;
  commentCount: number;
}

export interface FeedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FeedResponse {
  data: FeedBlog[];
  meta: FeedMeta;
}

// ─── Social ──────────────────────────────────────────────────────
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: Pick<User, "id" | "username">;
}

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

// ─── API Error ───────────────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

// Add to existing types

export interface Tag {
  id: string;
  name: string; // slug e.g. "technology"
  label: string; // display e.g. "Technology"
  color: string; // hex e.g. "#6366f1"
}

// Update FeedBlog
export interface FeedBlog {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: string;
  author: Pick<User, "id" | "username">;
  likeCount: number;
  commentCount: number;
  tags: Tag[]; // ← ADD
}

export type ViewMode = "grid" | "list";
