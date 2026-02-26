import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach JWT on every request from localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("chronospace_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to /login on 401
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthRoute = ["/login", "/register"].some((p) =>
        window.location.pathname.startsWith(p),
      );
      if (!isAuthRoute) {
        localStorage.removeItem("chronospace_token");
        localStorage.removeItem("chronospace_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
