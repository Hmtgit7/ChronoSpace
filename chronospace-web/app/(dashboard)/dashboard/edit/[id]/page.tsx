"use client";
import { use } from "react";
import { useBlog, useUpdateBlog } from "@/lib/hooks/useBlogs";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { BlogPageSkeleton } from "@/components/blog/BlogPageSkeleton";
import type { BlogFormData } from "@/components/blog/BlogEditor";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: blog, isLoading } = useBlog(id);
    const updateBlog = useUpdateBlog(id);

    const handleSubmit = async (data: BlogFormData) => {
        await updateBlog.mutateAsync({
            title: data.title,
            content: data.content,
            isPublished: data.isPublished,
        });
    };

    if (isLoading) return <BlogPageSkeleton />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <BlogEditor
                mode="edit"
                initialData={blog}
                onSubmit={handleSubmit}
                isLoading={updateBlog.isPending}
                error={updateBlog.error ? "Failed to update. Please try again." : null}
            />
        </div>
    );
}
