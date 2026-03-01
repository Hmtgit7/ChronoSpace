import { apiClient } from "./client";
import type { Tag } from "@/types";

export const tagsApi = {
  getAll: () => apiClient.get<Tag[]>("/tags").then((r) => r.data),

  create: (label: string, color?: string) =>
    apiClient.post<Tag>("/tags", { label, color }).then((r) => r.data),
};
