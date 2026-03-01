'use client';
import { use, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useBlog, useUpdateBlog } from '@/lib/hooks/useBlogs';
import { EditorTabs, type EditorTab } from '@/components/editor/EditorTabs';
import { EditorActions } from '@/components/editor/EditorActions';
import { cn } from '@/lib/utils';

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    content: z.string().min(10, 'Content must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: blog, isLoading } = useBlog(id);
    const updateBlog = useUpdateBlog(id);
    const [tab, setTab] = useState<EditorTab>('write');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (blog) reset({ title: blog.title, content: blog.content });
    }, [blog, reset]);

    const content = watch('content', '');
    const title = watch('title', '');
    const wordCount = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;

    const submit = (isPublished: boolean) => {
        handleSubmit((data) => {
            updateBlog.mutate({ ...data, isPublished });
        })();
    };

    if (isLoading) return <EditSkeleton />;
    if (!blog) return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted-foreground">Blog not found.</p>
            <Link href="/dashboard/blogs" className="text-primary text-sm mt-2 hover:underline">← Back to blogs</Link>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/blogs"
                        className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Edit Blog</h1>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{blog.title}</p>
                    </div>
                </div>
                {blog.isPublished && (
                    <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View live
                    </Link>
                )}
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                    <input
                        {...register('title')}
                        placeholder="Blog title…"
                        className={cn(
                            'w-full text-2xl font-bold bg-transparent border-0 border-b-2 pb-2',
                            'placeholder:text-muted-foreground/30 focus:outline-none transition-colors',
                            errors.title ? 'border-destructive' : 'border-border focus:border-primary'
                        )}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>

                {/* Editor */}
                <EditorTabs
                    tab={tab}
                    onTabChange={setTab}
                    content={content}
                    title={title}
                    register={register('content')}
                    error={errors.content?.message}
                    textareaRef={textareaRef}
                    onContentChange={(val) => setValue('content', val, { shouldValidate: true })}
                />

                {/* Actions */}
                <EditorActions
                    isPublished={blog.isPublished}
                    isPending={updateBlog.isPending}
                    wordCount={wordCount}
                    onSaveDraft={() => submit(false)}
                    onPublish={() => submit(!blog.isPublished)}
                    isEdit
                />
            </form>
        </motion.div>
    );
}

function EditSkeleton() {
    return (
        <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
            <div className="h-[500px] w-full bg-muted rounded-xl" />
        </div>
    );
}
