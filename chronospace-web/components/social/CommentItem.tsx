import { timeAgo, getInitials } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                {getInitials(comment.user.username)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                        @{comment.user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {timeAgo(comment.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{comment.content}</p>
            </div>
        </div>
    );
}
