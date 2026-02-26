'use client';
import { use } from 'react';
import { useBlog, useUpdateBlog, getApiError } from '@/lib/hooks/useBlogs';
import { BlogEditor, BlogFormData } from '@/components/blog/BlogEditor';
import { BlogCardSkeleton } from '@/components/blog/BlogSkeleton';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: blog, isLoading } = useBlog(id);
    const update = useUpdateBlog(id);

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

    const handleSubmit = async (data: BlogFormData) => {
        await update.mutateAsync(data);
    };

    return (
        <BlogEditor
            mode="edit"
            initialData={blog}
            onSubmit={handleSubmit}
            isLoading={update.isPending}
            error={update.error ? getApiError(update.error) : null}
        />
    );
}
