"use client";
import { motion } from "framer-motion";
import { Clock, X, RotateCcw } from "lucide-react";

interface Props {
    savedAt: string;
    onRestore: () => void;
    onDismiss: () => void;
}

export function RestoreDraftBanner({ savedAt, onRestore, onDismiss }: Props) {
    const time = new Date(savedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
        >
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm mb-4">
                <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                        Unsaved draft found from <strong>{time}</strong>. Restore it?
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onRestore}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                    </button>
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="w-6 h-6 rounded-lg hover:bg-amber-500/20 flex items-center justify-center text-amber-600 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
