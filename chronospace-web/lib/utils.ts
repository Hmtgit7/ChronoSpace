import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// ─── Date Helpers ──────────────────────────────────────────────

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Unknown date";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Unknown date";
  return format(d, "MMMM d, yyyy");
}

export function timeAgo(date: string | Date | null | undefined): string {
  if (!date) return "some time ago";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "some time ago";
  return formatDistanceToNow(d, { addSuffix: true });
}

// ─── Text Helpers ──────────────────────────────────────────────

export function readingTime(text: string | null | undefined): string {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
