// lib/hooks/useFeed.ts
"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public";

export const FEED_KEYS = {
  infinite: ["feed", "infinite"] as const,
  blog: (slug: string) => ["public-blog", slug] as const,
};

export function useFeedInfinite() {
  return useInfiniteQuery({
    queryKey: FEED_KEYS.infinite,
    queryFn: ({ pageParam = 1 }) => publicApi.getFeed(pageParam as number, 9),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
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
