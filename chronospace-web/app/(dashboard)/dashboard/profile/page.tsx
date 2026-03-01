"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, FileText, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMyProfile, useUpdateProfile } from "@/lib/hooks/useAuthor";
import { AuthorAvatar } from "@/components/profile/AuthorAvatar";
import { useAuthStore } from "@/lib/store/auth.store";

const schema = z.object({
    displayName: z
        .string()
        .min(2, "At least 2 characters")
        .max(50, "Max 50 characters")
        .optional()
        .or(z.literal("")),
    bio: z
        .string()
        .max(200, "Bio must be under 200 characters")
        .optional()
        .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { data: profile, isLoading } = useMyProfile();
    const updateProfile = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    // Populate form once profile loads
    useEffect(() => {
        if (profile) {
            reset({
                displayName: profile.displayName ?? "",
                bio: profile.bio ?? "",
            });
        }
    }, [profile, reset]);

    const bio = watch("bio") ?? "";
    const bioLength = bio.length;

    const onSubmit = async (data: FormData) => {
        await updateProfile.mutateAsync({
            displayName: data.displayName || undefined,
            bio: data.bio || undefined,
        });
        reset(data); // mark form as clean
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your public author profile
                    </p>
                </div>
                {user && (
                    <Link
                        href={`/u/${user.username}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
                    >
                        View public profile
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                )}
            </motion.div>

            {isLoading ? (
                <ProfileSkeleton />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Avatar preview */}
                    <div className="p-6 rounded-2xl border border-border bg-card flex items-center gap-5">
                        <AuthorAvatar
                            username={user?.username ?? ""}
                            displayName={watch("displayName")}
                            size="lg"
                        />
                        <div>
                            <p className="font-semibold">
                                {watch("displayName") || user?.username}
                            </p>
                            <p className="text-sm text-muted-foreground font-mono">
                                @{user?.username}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Avatar is auto-generated from your username
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 rounded-2xl border border-border bg-card space-y-5"
                    >
                        {/* Success banner */}
                        {updateProfile.isSuccess && !isDirty && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Profile updated successfully!
                            </motion.div>
                        )}

                        {/* Display name */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <User className="w-4 h-4 text-primary" />
                                Display Name
                            </label>
                            <input
                                {...register("displayName")}
                                placeholder={user?.username ?? "Your name"}
                                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {errors.displayName && (
                                <p className="text-xs text-destructive">
                                    {errors.displayName.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Shown instead of your username on blogs and your profile
                            </p>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Bio
                                </label>
                                <span
                                    className={`text-xs ${bioLength > 180
                                            ? "text-amber-500"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {bioLength}/200
                                </span>
                            </div>
                            <textarea
                                {...register("bio")}
                                rows={3}
                                placeholder="Tell readers a little about yourself…"
                                maxLength={200}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {errors.bio && (
                                <p className="text-xs text-destructive">{errors.bio.message}</p>
                            )}
                        </div>

                        {/* Read-only fields */}
                        <div className="pt-2 border-t border-border space-y-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                Account Info
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Username</p>
                                    <p className="text-sm font-mono text-primary">
                                        @{user?.username}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm truncate">{profile?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={updateProfile.isPending || !isDirty}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
                        >
                            {updateProfile.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="p-6 rounded-2xl border border-border bg-card flex items-center gap-5">
                <div className="w-14 h-14 bg-muted rounded-2xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                </div>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-10 bg-muted rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
