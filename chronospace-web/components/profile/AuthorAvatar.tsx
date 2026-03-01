import { cn, getInitials } from "@/lib/utils";

interface Props {
    username: string;
    displayName?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const SIZE_MAP = {
    sm: "w-8 h-8 text-xs rounded-lg",
    md: "w-10 h-10 text-sm rounded-xl",
    lg: "w-14 h-14 text-lg rounded-2xl",
    xl: "w-20 h-20 text-2xl rounded-3xl",
};

// Deterministic color from username
const AVATAR_COLORS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-indigo-500 to-blue-600",
];

function getAvatarColor(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function AuthorAvatar({ username, displayName, size = "md", className }: Props) {
    const initials = getInitials(displayName ?? username);
    const gradient = getAvatarColor(username);

    return (
        <div
            className={cn(
                "flex items-center justify-center font-bold text-white",
                `bg-gradient-to-br ${gradient}`,
                SIZE_MAP[size],
                className
            )}
        >
            {initials}
        </div>
    );
}
