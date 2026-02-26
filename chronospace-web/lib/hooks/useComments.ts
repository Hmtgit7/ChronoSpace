"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi } from "@/lib/api/blogs";

export const COMMENT_KEYS = {
  comments: (blogId: string) => ["comments", blogId] as const,
};

export function useComments(blogId: string) {
  return useQuery({
    queryKey: COMMENT_KEYS.comments(blogId),
    queryFn: () => blogsApi.getComments(blogId),
    enabled: !!blogId,
    staleTime: 15_000,
  });
}

export function useAddComment(blogId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => blogsApi.addComment(blogId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.comments(blogId) });
    },
  });
}
