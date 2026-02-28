'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Eye, EyeOff, Save, Send, Loader2, AlertCircle,
    Type, BookOpen, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Blog } from '@/types';

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    isPublished: z.boolean(),
});

export type BlogFormData = z.infer<typeof schema>;

interface Props {
    initialData?: Blog;
    onSubmit: (data: BlogFormData) => Promise<void>;
    isLoading: boolean;
    error?: string | null;
    mode: 'create' | 'edit';
}

type EditorTab = 'write' | 'preview';

export function BlogEditor({ initialData, onSubmit, isLoading, error, mode }: Props) {
    const [tab, setTab] = useState<EditorTab>('write');
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<BlogFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialData?.title ?? '',
            content: initialData?.content ?? '',
            isPublished: initialData?.isPublished ?? false,
        },
    });

    const content = watch('content');
    const title = watch('title');
    const isPublished = watch('isPublished');

    // Word count
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleFormSubmit = async (data: BlogFormData) => {
        await onSubmit(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6 gap-4"
            >
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/blogs"
                        className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">
                            {mode === 'create' ? 'New Blog' : 'Edit Blog'}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {wordCount} words · {readTime} min read
                        </p>
                    </div>
                </div>

                {/* Publish toggle */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setValue('isPublished', !isPublished, { shouldDirty: true })}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
                            isPublished
                                ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
                                : 'bg-secondary text-muted-foreground border-border hover:border-primary/30'
                        )}
                    >
                        {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success flash */}
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm"
                        >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            Blog {mode === 'create' ? 'created' : 'updated'} successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Type className="w-4 h-4 text-primary" /> Title
                    </label>
                    <input
                        {...register('title')}
                        placeholder="Give your blog a compelling title..."
                        className={cn(
                            'w-full px-4 py-3.5 rounded-xl bg-card border transition-all text-base font-medium',
                            'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
                            errors.title ? 'border-destructive' : 'border-border focus:border-primary'
                        )}
                    />
                    {errors.title && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />{errors.title.message}
                        </p>
                    )}
                </motion.div>

                {/* Editor tabs + textarea */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-0"
                >
                    {/* Tab row */}
                    <div className="flex items-center justify-between border-x border-t border-border rounded-t-xl px-3 pt-2 bg-card">
                        <div className="flex">
                            {(['write', 'preview'] as EditorTab[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTab(t)}
                                    className={cn(
                                        'flex items-center gap-1.5 px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-all -mb-px',
                                        tab === t
                                            ? 'border-b-2 border-primary text-primary bg-background'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {t === 'write' ? <Type className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                                    {t}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground pb-2">Markdown supported</span>
                    </div>

                    {/* Content area */}
                    <div className="border border-border rounded-b-xl overflow-hidden bg-card">
                        <AnimatePresence mode="wait" initial={false}>
                            {tab === 'write' ? (
                                <motion.div
                                    key="write"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <textarea
                                        {...register('content')}
                                        rows={22}
                                        placeholder={`Write your blog post here...\n\n# Heading 1\n## Heading 2\n\n**Bold text** and *italic text*\n\n- List item\n- Another item\n\n\`\`\`js\ncode block\n\`\`\``}
                                        className={cn(
                                            'w-full px-5 py-4 bg-transparent resize-none font-mono text-sm leading-7',
                                            'placeholder:text-muted-foreground/40 focus:outline-none',
                                            errors.content && 'border-destructive'
                                        )}
                                        spellCheck
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="min-h-[440px] px-5 py-4"
                                >
                                    {content ? (
                                        <article className="blog-content">
                                            {title && <h1 className="text-3xl font-bold mb-6 text-foreground">{title}</h1>}
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {content}
                                            </ReactMarkdown>
                                        </article>
                                    ) : (
                                        <div className="flex items-center justify-center h-40 text-muted-foreground/50 text-sm">
                                            Nothing to preview yet. Switch to Write tab and add content.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {errors.content && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />{errors.content.message}
                        </p>
                    )}
                </motion.div>

                {/* Bottom action bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2"
                >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{wordCount} words</span>
                        <span>·</span>
                        <span>~{readTime} min read</span>
                        {isPublished && (
                            <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-green-500">
                                    <Eye className="w-3 h-3" /> Will be public
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Save draft */}
                        <button
                            type="button"
                            onClick={() => {
                                setValue('isPublished', false);
                                handleSubmit(handleFormSubmit)();
                            }}
                            disabled={isLoading || !isDirty}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save className="w-4 h-4" />
                            Save Draft
                        </button>

                        {/* Publish */}
                        <button
                            type="submit"
                            onClick={() => setValue('isPublished', true)}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md shadow-primary/25 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                            ) : (
                                <><Send className="w-4 h-4" />{isPublished ? 'Update' : 'Publish'}</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </form>
        </div>
    );
}
