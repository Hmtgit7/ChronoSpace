'use client';
import type { RefObject } from 'react';
import { Bold, Italic, Heading2, Code, Link2, List, Quote } from 'lucide-react';

type WrapFn = (before: string, after?: string) => void;

const TOOLBAR_ITEMS = [
    { icon: Bold, label: 'Bold', before: '**', after: '**' },
    { icon: Italic, label: 'Italic', before: '_', after: '_' },
    { icon: Heading2, label: 'Heading', before: '## ', after: '' },
    { icon: Code, label: 'Code', before: '`', after: '`' },
    { icon: Link2, label: 'Link', before: '[', after: '](url)' },
    { icon: List, label: 'List', before: '- ', after: '' },
    { icon: Quote, label: 'Quote', before: '> ', after: '' },
];

interface EditorToolbarProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    onChange: (val: string) => void;
}

export function EditorToolbar({ textareaRef, onChange }: EditorToolbarProps) {
    const wrap: WrapFn = (before, after = '') => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.substring(start, end);
        const newVal =
            ta.value.substring(0, start) +
            before +
            (selected || 'text') +
            after +
            ta.value.substring(end);
        onChange(newVal);
        requestAnimationFrame(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
        });
    };

    return (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/40">
            {TOOLBAR_ITEMS.map(({ icon: Icon, label, before, after }) => (
                <button
                    key={label}
                    type="button"
                    title={label}
                    onClick={() => wrap(before, after)}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                    <Icon className="w-3.5 h-3.5" />
                </button>
            ))}
        </div>
    );
}
