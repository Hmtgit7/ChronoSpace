"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api/blogs";
import { FEED_KEYS } from "./useFeed";
import type { InfiniteData } from "@tanstack/react-query";
import type { FeedResponse } from "@/types";

export function useLike(blogId: string) {
  const qc = useQueryClient();

  // Optimistic updater — patches the infinite query cache in-place
  const optimisticUpdate = (delta: number) => {
    qc.setQueryData<InfiniteData<FeedResponse>>(FEED_KEYS.infinite, (old) => {
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
    });
  };

  const like = useMutation({
    mutationFn: () => blogsApi.like(blogId),
    onMutate: () => optimisticUpdate(1),
    onError: () => optimisticUpdate(-1),
    onSettled: () => qc.invalidateQueries({ queryKey: FEED_KEYS.infinite }),
  });

  const unlike = useMutation({
    mutationFn: () => blogsApi.unlike(blogId),
    onMutate: () => optimisticUpdate(-1),
    onError: () => optimisticUpdate(1),
    onSettled: () => qc.invalidateQueries({ queryKey: FEED_KEYS.infinite }),
  });

  return { like, unlike };
}
