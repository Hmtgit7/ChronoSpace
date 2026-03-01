import { motion } from "framer-motion";
import { FileText, Heart, MessageSquare } from "lucide-react";

interface Props {
    stats: {
        publishedBlogs: number;
        totalLikes: number;
        totalComments: number;
    };
}

const STATS = [
    { key: "publishedBlogs", label: "Blogs", icon: FileText },
    { key: "totalLikes", label: "Likes", icon: Heart },
    { key: "totalComments", label: "Comments", icon: MessageSquare },
] as const;

export function AuthorStats({ stats }: Props) {
    return (
        <div className="flex items-center gap-6">
            {STATS.map(({ key, label, icon: Icon }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex flex-col items-center sm:items-start"
                >
                    <span className="text-2xl font-bold">{stats[key]}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Icon className="w-3 h-3" />
                        {label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
