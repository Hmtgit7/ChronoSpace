"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api/blogs";
import type { InfiniteData } from "@tanstack/react-query";
import type { FeedResponse } from "@/types";

// Base prefix that matches ALL infinite feed cache entries
// regardless of sort/tag combination
const FEED_INFINITE_BASE = ["feed", "infinite"] as const;

export function useLike(blogId: string) {
  const qc = useQueryClient();

  const optimisticUpdate = (delta: number) => {
    // Use predicate to match ALL ["feed", "infinite", ...] cache keys
    // This covers latest/trending + any tag filter combination
    qc.setQueriesData<InfiniteData<FeedResponse>>(
      { queryKey: FEED_INFINITE_BASE },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((b) =>
              b.id === blogId ? { ...b, likeCount: b.likeCount + delta } : b,
            ),
          })),
        };
      },
    );
  };

  const like = useMutation({
    mutationFn: () => blogsApi.like(blogId),
    onMutate: () => optimisticUpdate(1),
    onError: () => optimisticUpdate(-1),
    onSettled: () => qc.invalidateQueries({ queryKey: FEED_INFINITE_BASE }),
  });

  const unlike = useMutation({
    mutationFn: () => blogsApi.unlike(blogId),
    onMutate: () => optimisticUpdate(-1),
    onError: () => optimisticUpdate(1),
    onSettled: () => qc.invalidateQueries({ queryKey: FEED_INFINITE_BASE }),
  });

  return { like, unlike };
}
