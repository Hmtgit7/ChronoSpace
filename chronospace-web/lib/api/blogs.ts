import { apiClient } from "./client";
import type {
  Blog,
  CreateBlogPayload,
  UpdateBlogPayload,
  Comment,
  LikeResponse,
} from "@/types";

export const blogsApi = {
  getAll: () => apiClient.get<Blog[]>("/blogs").then((r) => r.data),

  getOne: (id: string) =>
    apiClient.get<Blog>(`/blogs/${id}`).then((r) => r.data),

  create: (data: CreateBlogPayload) =>
    apiClient.post<Blog>("/blogs", data).then((r) => r.data),

  update: (id: string, data: UpdateBlogPayload) =>
    apiClient.patch<Blog>(`/blogs/${id}`, data).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/blogs/${id}`).then((r) => r.data),

  like: (id: string) =>
    apiClient.post<LikeResponse>(`/blogs/${id}/like`).then((r) => r.data),

  unlike: (id: string) =>
    apiClient.delete<LikeResponse>(`/blogs/${id}/like`).then((r) => r.data),

  getComments: (id: string) =>
    apiClient.get<Comment[]>(`/blogs/${id}/comments`).then((r) => r.data),

  addComment: (id: string, content: string) =>
    apiClient
      .post<Comment>(`/blogs/${id}/comments`, { content })
      .then((r) => r.data),
};
