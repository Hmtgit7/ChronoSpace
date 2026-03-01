"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { publicApi, type FeedSort } from "@/lib/api/public";

export const FEED_KEYS = {
  infinite: (sort: FeedSort, tag?: string) =>
    ["feed", "infinite", sort, tag ?? "all"] as const,
  blog: (slug: string) => ["public-blog", slug] as const,
  tags: ["feed", "tags"] as const,
};

export function useFeedInfinite(sort: FeedSort = "latest", tag?: string) {
  return useInfiniteQuery({
    queryKey: FEED_KEYS.infinite(sort, tag),
    queryFn: ({ pageParam = 1 }) =>
      publicApi.getFeed(pageParam as number, 9, sort, tag),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30_000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: FEED_KEYS.tags,
    queryFn: publicApi.getTags,
    staleTime: 5 * 60 * 1000, // tags rarely change
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
