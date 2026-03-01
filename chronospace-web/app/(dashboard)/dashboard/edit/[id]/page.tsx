"use client";
import { use } from "react";
import { useBlog, useUpdateBlog, getApiError } from "@/lib/hooks/useBlogs";
import { BlogEditor, type BlogFormData } from "@/components/blog/BlogEditor";
import { BlogCardSkeleton } from "@/components/blog/BlogListSkeleton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: blog, isLoading } = useBlog(id);
    const update = useUpdateBlog(id);

    const handleSubmit = async (data: BlogFormData) => {
        await update.mutateAsync(data);
        update.reset();
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-4">
                <div className="h-10 w-48 bg-muted rounded-xl animate-pulse" />
                <BlogCardSkeleton />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="max-w-5xl mx-auto text-center py-20">
                <p className="text-muted-foreground">Blog not found.</p>
            </div>
        );
    }

    return (
        <BlogEditor
            mode="edit"
            initialData={blog}
            blogId={id}
            onSubmit={handleSubmit}
            isLoading={update.isPending}
            error={update.error ? getApiError(update.error) : null}
        />
    );
}
