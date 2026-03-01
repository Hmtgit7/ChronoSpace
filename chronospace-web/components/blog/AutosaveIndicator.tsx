"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { AutosaveStatus } from "@/lib/hooks/useAutosave";

interface Props {
    status: AutosaveStatus;
}

export function AutosaveIndicator({ status }: Props) {
    if (status.type === "idle") return null;

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={status.type}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-xs"
            >
                {status.type === "saving" && (
                    <>
                        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">Autosaving…</span>
                    </>
                )}
                {status.type === "saved" && (
                    <>
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">
                            Saved at{" "}
                            {status.time.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </>
                )}
                {status.type === "error" && (
                    <>
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400">
                            Autosave failed
                        </span>
                    </>
                )}
            </motion.span>
        </AnimatePresence>
    );
}
