"use client";
import { useEffect, useRef, useCallback } from "react";
import type { BlogFormData } from "@/components/blog/BlogEditor";

const STORAGE_KEY = (id: string) => `autosave-draft-${id}`;
const AUTOSAVE_INTERVAL = 30_000; // 30 seconds

interface Options {
  blogId: string | null; // null = new blog (not yet created)
  data: BlogFormData;
  isDirty: boolean;
  isPublished: boolean;
  onSave: (data: BlogFormData) => Promise<void>;
  onStatusChange: (status: AutosaveStatus) => void;
}

export type AutosaveStatus =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "saved"; time: Date }
  | { type: "error"; message: string };

export function useAutosave({
  blogId,
  data,
  isDirty,
  isPublished,
  onSave,
  onStatusChange,
}: Options) {
  const latestData = useRef(data);
  const latestDirty = useRef(isDirty);

  // Keep refs current without triggering effect re-runs
  useEffect(() => {
    latestData.current = data;
  }, [data]);
  useEffect(() => {
    latestDirty.current = isDirty;
  }, [isDirty]);

  // ── localStorage backup (runs on every data change) ──
  useEffect(() => {
    if (!blogId || !isDirty || isPublished) return;
    try {
      localStorage.setItem(
        STORAGE_KEY(blogId),
        JSON.stringify({ data, savedAt: new Date().toISOString() }),
      );
    } catch {
      // quota exceeded — silently ignore
    }
  }, [data, blogId, isDirty, isPublished]);

  // ── Interval autosave ──────────────────────────────
  useEffect(() => {
    // Only autosave existing drafts (blogId must exist)
    if (!blogId) return;

    const interval = setInterval(async () => {
      if (!latestDirty.current || isPublished) return;

      onStatusChange({ type: "saving" });
      try {
        await onSave(latestData.current);
        onStatusChange({ type: "saved", time: new Date() });
        // Clear localStorage backup on successful server save
        localStorage.removeItem(STORAGE_KEY(blogId));
      } catch (err) {
        onStatusChange({
          type: "error",
          message: err instanceof Error ? err.message : "Autosave failed",
        });
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [blogId, isPublished, onSave, onStatusChange]);

  // ── Restore helper ─────────────────────────────────
  const getLocalBackup = useCallback((): {
    data: BlogFormData;
    savedAt: string;
  } | null => {
    if (!blogId) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY(blogId));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [blogId]);

  const clearLocalBackup = useCallback(() => {
    if (!blogId) return;
    localStorage.removeItem(STORAGE_KEY(blogId));
  }, [blogId]);

  return { getLocalBackup, clearLocalBackup };
}
