"use client";
import { useCreateBlog } from "@/lib/hooks/useBlogs";
import { BlogEditor } from "@/components/blog/BlogEditor";
import type { BlogFormData } from "@/components/blog/BlogEditor";

export default function NewBlogPage() {
    const createBlog = useCreateBlog();

    const handleSubmit = async (data: BlogFormData) => {
        await createBlog.mutateAsync({
            title: data.title,
            content: data.content,
            isPublished: data.isPublished,
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <BlogEditor
                mode="create"
                onSubmit={handleSubmit}
                isLoading={createBlog.isPending}
                error={createBlog.error ? "Failed to save. Please try again." : null}
            />
        </div>
    );
}
