"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { blogsApi } from "@/lib/api/blogs";
import { useToast } from "@/components/common/Toast";
import type { CreateBlogPayload, UpdateBlogPayload, ApiError } from "@/types";

export const BLOG_KEYS = {
  all: ["blogs"] as const,
  one: (id: string) => ["blogs", id] as const,
};

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    const m = data?.message;
    if (Array.isArray(m)) return m[0];
    if (typeof m === "string") return m;
  }
  return "Something went wrong.";
}

export function useMyBlogs() {
  return useQuery({
    queryKey: BLOG_KEYS.all,
    queryFn: blogsApi.getAll,
    staleTime: 30_000,
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: BLOG_KEYS.one(id),
    queryFn: () => blogsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: CreateBlogPayload) => blogsApi.create(data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.all });
      toast(
        "success",
        blog.isPublished ? "Blog published! 🎉" : "Draft saved",
        blog.isPublished
          ? "Your blog is now live on the feed."
          : "You can publish it anytime.",
      );
    },
    onError: (error) =>
      toast("error", "Failed to create blog", getApiError(error)),
  });
}

export function useUpdateBlog(id: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: UpdateBlogPayload) => blogsApi.update(id, data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.all });
      qc.invalidateQueries({ queryKey: BLOG_KEYS.one(id) });
      toast(
        "success",
        blog.isPublished ? "Blog updated & live ✓" : "Draft saved",
        blog.isPublished
          ? "Changes are visible on the public feed."
          : "Saved as draft.",
      );
    },
    onError: (error) => toast("error", "Update failed", getApiError(error)),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => blogsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.all });
      toast(
        "success",
        "Blog deleted",
        "Your blog has been permanently removed.",
      );
    },
    onError: (error) => toast("error", "Delete failed", getApiError(error)),
  });
}
