"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import { useToast } from "@/components/common/Toast";
import type { LoginPayload, RegisterPayload, ApiError } from "@/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0];
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong. Please try again.";
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      toast("success", "Welcome back!", `Signed in as @${res.user.username}`);
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      toast("error", "Sign in failed", getErrorMessage(error));
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      toast(
        "success",
        "Account created!",
        `Welcome to ChronoSpace, @${res.user.username}!`,
      );
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      toast("error", "Registration failed", getErrorMessage(error));
    },
  });
}
