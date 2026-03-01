'use client';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/public';

export const FEED_KEYS = {
  feed: (page: number) => ['feed', page] as const,
  infiniteFeed: (search: string) => ['feed-infinite', search] as const,
  blog: (slug: string) => ['public-blog', slug] as const,
};

export function useFeed(page = 1) {
  return useQuery({
    queryKey: FEED_KEYS.feed(page),
    queryFn: () => publicApi.getFeed(page, 9),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useInfiniteFeed(search = '') {
  return useInfiniteQuery({
    queryKey: FEED_KEYS.infiniteFeed(search),
    queryFn: ({ pageParam }) => publicApi.getFeed(pageParam as number, 9, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 30_000,
  });
}

export function usePublicBlog(slug: string) {
  return useQuery({
    queryKey: FEED_KEYS.blog(slug),
    queryFn: () => publicApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 60_000,
  });
}
