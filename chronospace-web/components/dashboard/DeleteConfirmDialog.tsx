'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
    open: boolean;
    title: string;
    isPending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmDialog({
    open, title, isPending, onConfirm, onCancel,
}: DeleteConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={onCancel}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 8 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4"
                    >
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-destructive" />
                                </div>
                                <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-1">Delete blog?</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                &ldquo;<span className="font-medium text-foreground">{title}</span>&rdquo; will be permanently deleted. This cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={onCancel} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={isPending}
                                    onClick={onConfirm}
                                    className="flex-1"
                                >
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
