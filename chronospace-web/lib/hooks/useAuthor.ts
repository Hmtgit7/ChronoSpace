"use client";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public";
import { profileApi } from "@/lib/api/profile";

export const AUTHOR_KEYS = {
  profile: (username: string) => ["author", username] as const,
  blogs: (username: string) => ["author", username, "blogs"] as const,
  myProfile: ["my-profile"] as const,
};

export function useAuthorProfile(username: string) {
  return useQuery({
    queryKey: AUTHOR_KEYS.profile(username),
    queryFn: () => publicApi.getAuthorProfile(username),
    enabled: !!username,
    staleTime: 60_000,
  });
}

export function useAuthorBlogs(username: string) {
  return useInfiniteQuery({
    queryKey: AUTHOR_KEYS.blogs(username),
    queryFn: ({ pageParam = 1 }) =>
      publicApi.getAuthorBlogs(username, pageParam as number),
    getNextPageParam: (last) =>
      last.meta.hasNextPage ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!username,
    staleTime: 30_000,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: AUTHOR_KEYS.myProfile,
    queryFn: profileApi.get,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (updated) => {
      qc.setQueryData(AUTHOR_KEYS.myProfile, updated);
      // Also invalidate the public profile cache
      qc.invalidateQueries({
        queryKey: AUTHOR_KEYS.profile(updated.username),
      });
    },
  });
}
