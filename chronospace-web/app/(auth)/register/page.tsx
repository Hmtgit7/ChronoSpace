"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Feather, ArrowRight, Loader2 } from "lucide-react";
import { useRegister } from "@/lib/hooks/useAuth";
import { AxiosError } from "axios";
import type { ApiError } from "@/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const schema = z.object({
    username: z
        .string()
        .min(3, "At least 3 characters")
        .max(20, "Max 20 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and - only"),
    email: z.string().email("Please enter a valid email"),
    password: z
        .string()
        .min(8, "At least 8 characters")
        .max(64, "Max 64 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const register_ = useRegister();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const password = watch("password") ?? "";
    const strength =
        password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 4 ? 1 : 0;
    const strengthLabels = ["", "Weak", "Good", "Strong"];
    const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-green-400"];

    const onSubmit = (data: FormData) => register_.mutate(data);

    const serverError =
        register_.error instanceof AxiosError
            ? (() => {
                const d = register_.error.response?.data as ApiError;
                const m = d?.message;
                return Array.isArray(m) ? m[0] : (m ?? "Registration failed");
            })()
            : null;

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-card border-r border-border flex-col justify-between p-12 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2 z-10">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
                        <Feather className="w-4.5 h-4.5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>

                {/* Middle */}
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                        Join a community<br />of writers.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                        Free forever. No ads. No tracking. Just you, your words, and an
                        audience that loves them.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Free Forever", emoji: "✦" },
                            { label: "Private Drafts", emoji: "🔒" },
                            { label: "Public Feed", emoji: "🌐" },
                            { label: "AI Summaries", emoji: "⚡" },
                        ].map(({ label, emoji }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background/50 text-sm"
                            >
                                <span>{emoji}</span>
                                <span className="font-medium text-sm">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs text-muted-foreground/60">
                    Start writing in under 60 seconds
                </p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link
                        href="/"
                        className="flex lg:hidden items-center gap-2 mb-8 justify-center"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Feather className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">
                            Chrono<span className="text-primary">Space</span>
                        </span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-1.5">Create your account</h1>
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary font-medium hover:underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Server error */}
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                            >
                                {serverError}
                            </motion.div>
                        )}

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Username</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register("username")}
                                    type="text"
                                    placeholder="yourname"
                                    autoComplete="username"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none",
                                        "focus:border-primary focus:ring-2 focus:ring-primary/15",
                                        errors.username ? "border-destructive" : "border-border"
                                    )}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-destructive">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none",
                                        "focus:border-primary focus:ring-2 focus:ring-primary/15",
                                        errors.email ? "border-destructive" : "border-border"
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none",
                                        "focus:border-primary focus:ring-2 focus:ring-primary/15",
                                        errors.password ? "border-destructive" : "border-border"
                                    )}
                                />
                            </div>

                            {/* Password strength bar */}
                            {password.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={cn(
                                                    "h-1 flex-1 rounded-full transition-all duration-300",
                                                    strength >= level
                                                        ? strengthColors[strength]
                                                        : "bg-border"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {strengthLabels[strength]}
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={register_.isPending}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20 text-sm mt-1"
                        >
                            {register_.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-muted-foreground pt-1">
                            By creating an account you agree to our terms of service.
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
