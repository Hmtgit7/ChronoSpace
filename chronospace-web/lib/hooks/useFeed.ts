"use client";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public";

export const FEED_KEYS = {
  feed: (page: number) => ["feed", page] as const,
  blog: (slug: string) => ["public-blog", slug] as const,
};

export function useFeed(page = 1) {
  return useQuery({
    queryKey: FEED_KEYS.feed(page),
    queryFn: () => publicApi.getFeed(page, 9),
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keep previous page while loading next
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
