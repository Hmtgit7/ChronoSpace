"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api/blogs";
import { FEED_KEYS } from "./useFeed";
import type { FeedResponse } from "@/types";

export function useLike(blogId: string, currentPage: number) {
  const qc = useQueryClient();

  // Optimistic updater helper
  const optimisticUpdate = (liked: boolean, delta: number) => {
    qc.setQueryData<FeedResponse>(FEED_KEYS.feed(currentPage), (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((b) =>
          b.id === blogId ? { ...b, likeCount: b.likeCount + delta } : b,
        ),
      };
    });
  };

  const like = useMutation({
    mutationFn: () => blogsApi.like(blogId),
    onMutate: () => optimisticUpdate(true, 1),
    onError: () => optimisticUpdate(false, -1),
    onSettled: () =>
      qc.invalidateQueries({ queryKey: FEED_KEYS.feed(currentPage) }),
  });

  const unlike = useMutation({
    mutationFn: () => blogsApi.unlike(blogId),
    onMutate: () => optimisticUpdate(false, -1),
    onError: () => optimisticUpdate(true, 1),
    onSettled: () =>
      qc.invalidateQueries({ queryKey: FEED_KEYS.feed(currentPage) }),
  });

  return { like, unlike };
}
