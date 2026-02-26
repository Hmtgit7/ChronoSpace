import { apiClient } from './client';
import type { FeedResponse, Blog } from '@/types';

export const publicApi = {
  getFeed: (page = 1, limit = 9) =>
    apiClient
      .get<FeedResponse>('/public/feed', { params: { page, limit } })
      .then((r) => r.data),

  getBlogBySlug: (slug: string) =>
    apiClient.get<Blog>(`/public/blogs/${slug}`).then((r) => r.data),
};
