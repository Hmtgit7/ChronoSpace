import { apiClient } from "./client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types";

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  me: () => apiClient.get<User>("/auth/me").then((r) => r.data),
};
