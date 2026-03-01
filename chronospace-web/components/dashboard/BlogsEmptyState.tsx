import Link from "next/link";
import { PenSquare, FileText } from "lucide-react";

interface Props {
    variant: "all" | "published" | "draft";
}

const MESSAGES = {
    all: {
        title: "No blogs yet",
        desc: "Write your first blog post and share your ideas with the world.",
    },
    published: {
        title: "No published blogs",
        desc: "Publish a draft to make it visible on the public feed.",
    },
    draft: {
        title: "No drafts",
        desc: "Start writing something new — it'll be saved as a draft automatically.",
    },
};

export function BlogsEmptyState({ variant }: Props) {
    const { title, desc } = MESSAGES[variant];

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-base mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">{desc}</p>
            <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <PenSquare className="w-4 h-4" />
                New Blog
            </Link>
        </div>
    );
}
