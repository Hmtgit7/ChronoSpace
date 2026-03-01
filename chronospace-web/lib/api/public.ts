import { apiClient } from "./client";
import type { FeedResponse, Blog, Tag, AuthorProfile } from "@/types";

export type FeedSort = "latest" | "trending";

export const publicApi = {
  getFeed: (page = 1, limit = 9, sort: FeedSort = "latest", tag?: string) =>
    apiClient
      .get<FeedResponse>("/public/feed", {
        params: { page, limit, sort, ...(tag && { tag }) },
      })
      .then((r) => r.data),

  getBlogBySlug: (slug: string) =>
    apiClient.get<Blog>(`/public/blogs/${slug}`).then((r) => r.data),

  getTags: () => apiClient.get<Tag[]>("/public/tags").then((r) => r.data),

  getAuthorProfile: (username: string) =>
    apiClient
      .get<AuthorProfile>(`/public/users/${username}`)
      .then((r) => r.data),

  getAuthorBlogs: (username: string, page = 1, limit = 9) =>
    apiClient
      .get<FeedResponse>(`/public/users/${username}/blogs`, {
        params: { page, limit },
      })
      .then((r) => r.data),
};
