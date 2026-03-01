'use client';
import { Loader2, Save, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorActionsProps {
    isPublished: boolean;
    isPending: boolean;
    wordCount: number;
    onSaveDraft: () => void;
    onPublish: () => void;
    isEdit?: boolean;
}

export function EditorActions({
    isPublished, isPending, wordCount, onSaveDraft, onPublish, isEdit = false,
}: EditorActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-muted-foreground tabular-nums">
                {wordCount.toLocaleString()} words
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Save as Draft (hide on edit if already draft) */}
                {(!isEdit || !isPublished) && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={onSaveDraft}
                        className="flex-1 sm:flex-none"
                    >
                        {isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        ) : (
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        {isEdit ? 'Save' : 'Save Draft'}
                    </Button>
                )}

                {/* Publish / Unpublish */}
                <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={onPublish}
                    className="flex-1 sm:flex-none"
                >
                    {isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : isPublished ? (
                        <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                    ) : (
                        <Globe className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {isPublished ? 'Unpublish' : 'Publish'}
                </Button>
            </div>
        </div>
    );
}
