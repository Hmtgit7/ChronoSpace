import { apiClient } from "./client";
import type { UserProfile } from "@/types";

export const profileApi = {
  get: () => apiClient.get<UserProfile>("/profile").then((r) => r.data),

  update: (data: { displayName?: string; bio?: string }) =>
    apiClient.patch<UserProfile>("/profile", data).then((r) => r.data),
};
