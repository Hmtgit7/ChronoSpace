'use client';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateBlog } from '@/lib/hooks/useBlogs';
import { EditorTabs, type EditorTab } from '@/components/editor/EditorTabs';
import { EditorActions } from '@/components/editor/EditorActions';
import { cn } from '@/lib/utils';

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Too long'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

export default function NewBlogPage() {
    const router = useRouter();
    const createBlog = useCreateBlog();
    const [tab, setTab] = useState<EditorTab>('write');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { title: '', content: '' },
    });

    const content = watch('content');
    const title = watch('title');
    const wordCount = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;

    const submit = (isPublished: boolean) => {
        handleSubmit((data) => {
            createBlog.mutate(
                { ...data, isPublished },
                { onSuccess: () => router.push('/dashboard/blogs') }
            );
        })();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-foreground">New Blog</h1>
                    <p className="text-xs text-muted-foreground">Write and publish your story</p>
                </div>
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
                            errors.title
                                ? 'border-destructive'
                                : 'border-border focus:border-primary'
                        )}
                    />
                    {errors.title && (
                        <p className="text-xs text-destructive">{errors.title.message}</p>
                    )}
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
                    isPublished={false}
                    isPending={createBlog.isPending}
                    wordCount={wordCount}
                    onSaveDraft={() => submit(false)}
                    onPublish={() => submit(true)}
                />
            </form>
        </motion.div>
    );
}
