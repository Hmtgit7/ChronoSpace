"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "@/lib/api/tags";
import type { Tag } from "@/types";

export const TAG_KEYS = {
  all: ["tags"] as const,
};

export function useTags() {
  return useQuery({
    queryKey: TAG_KEYS.all,
    queryFn: tagsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ label, color }: { label: string; color?: string }) =>
      tagsApi.create(label, color),

    // Optimistic insert into cache before server responds
    onMutate: async ({ label }) => {
      await qc.cancelQueries({ queryKey: TAG_KEYS.all });
      const previous = qc.getQueryData<Tag[]>(TAG_KEYS.all);

      const optimistic: Tag = {
        id: `temp-${Date.now()}`,
        name: label.toLowerCase().replace(/\s+/g, "-"),
        label,
        color: "#6366f1",
      };

      qc.setQueryData<Tag[]>(TAG_KEYS.all, (old = []) =>
        [...old, optimistic].sort((a, b) => a.label.localeCompare(b.label)),
      );

      return { previous, optimistic };
    },

    // Replace temp tag with real one from server
    onSuccess: (newTag, _, ctx) => {
      qc.setQueryData<Tag[]>(TAG_KEYS.all, (old = []) =>
        old
          .map((t) => (t.id === ctx?.optimistic.id ? newTag : t))
          .sort((a, b) => a.label.localeCompare(b.label)),
      );
    },

    // Rollback on error
    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(TAG_KEYS.all, ctx.previous);
      }
    },
  });
}
