"use client";
import { useRouter } from "next/navigation";
import { useCreateBlog, getApiError } from "@/lib/hooks/useBlogs";
import { BlogEditor, type BlogFormData } from "@/components/blog/BlogEditor";

export default function NewBlogPage() {
    const router = useRouter();
    const create = useCreateBlog();

    const handleSubmit = async (data: BlogFormData) => {
        const blog = await create.mutateAsync(data);
        create.reset();
        router.push(`/dashboard/edit/${blog.id}`);
    };

    return (
        <BlogEditor
            mode="create"
            onSubmit={handleSubmit}
            isLoading={create.isPending}
            error={create.error ? getApiError(create.error) : null}
        />
    );
}
