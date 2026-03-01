import { motion } from "framer-motion";
import { getInitials, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types";

interface Props {
    comment: Comment;
    index: number;
}

export function CommentItem({ comment, index }: Props) {
    const username = comment.user?.username ?? "Anonymous";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex gap-3 group"
        >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-primary text-xs font-bold uppercase flex-shrink-0 mt-0.5">
                {getInitials(username)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground/90">
                        {username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {timeAgo(comment.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                    {comment.content}
                </p>
            </div>
        </motion.div>
    );
}
