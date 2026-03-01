import { apiClient } from "./client";
import type { FeedResponse, Blog, Tag } from "@/types";

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
};
