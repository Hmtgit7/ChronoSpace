'use client';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './EditorToolbar';
import type { RefObject } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type EditorTab = 'write' | 'preview';

interface EditorTabsProps {
    tab: EditorTab;
    onTabChange: (t: EditorTab) => void;
    content: string;
    title: string;
    register: UseFormRegisterReturn;
    error?: string;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    onContentChange: (val: string) => void;
}

export function EditorTabs({
    tab, onTabChange, content, title, register, error, textareaRef, onContentChange,
}: EditorTabsProps) {
    return (
        <div className="rounded-xl border border-border overflow-hidden bg-card">
            {/* Tab header */}
            <div className="flex items-center justify-between border-b border-border px-3 bg-muted/30">
                <div className="flex">
                    {(['write', 'preview'] as EditorTab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => onTabChange(t)}
                            className={cn(
                                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2',
                                tab === t
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t === 'write'
                                ? <Type className="w-3.5 h-3.5" />
                                : <BookOpen className="w-3.5 h-3.5" />}
                            {t}
                        </button>
                    ))}
                </div>
                <span className="text-[11px] text-muted-foreground/60 pr-1">Markdown</span>
            </div>

            {/* Toolbar (write only) */}
            {tab === 'write' && (
                <EditorToolbar textareaRef={textareaRef} onChange={onContentChange} />
            )}

            {/* Content */}
            <AnimatePresence mode="wait" initial={false}>
                {tab === 'write' ? (
                    <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                        <textarea
                            {...register}
                            ref={(el) => {
                                (register as { ref: (el: HTMLTextAreaElement | null) => void }).ref(el);
                                (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                            }}
                            rows={22}
                            placeholder={`Write your blog post here…\n\n# Heading\n\n**Bold**, _italic_, \`code\`\n\n- List item\n\n> Blockquote`}
                            className={cn(
                                'w-full px-5 py-4 bg-transparent resize-none font-mono text-sm leading-7',
                                'placeholder:text-muted-foreground/30 focus:outline-none',
                                error && 'ring-1 ring-destructive'
                            )}
                            spellCheck
                        />
                    </motion.div>
                ) : (
                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="min-h-[440px] px-5 py-4">
                        {content ? (
                            <article className="blog-content">
                                {title && <h1 className="text-3xl font-bold mb-6 text-foreground">{title}</h1>}
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </article>
                        ) : (
                            <div className="flex items-center justify-center h-40 text-muted-foreground/40 text-sm">
                                Nothing to preview. Switch to Write and add content.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="px-5 pb-3 text-xs text-destructive">{error}</p>}
        </div>
    );
}
