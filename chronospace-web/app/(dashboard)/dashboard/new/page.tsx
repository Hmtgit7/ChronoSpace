'use client';
import { useRouter } from 'next/navigation';
import { useCreateBlog, getApiError } from '@/lib/hooks/useBlogs';
import { BlogEditor, BlogFormData } from '@/components/blog/BlogEditor';

export default function NewBlogPage() {
    const router = useRouter();
    const create = useCreateBlog();

    const handleSubmit = async (data: BlogFormData) => {
        const blog = await create.mutateAsync(data);
        // Navigate to edit page after create so user can keep editing
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
