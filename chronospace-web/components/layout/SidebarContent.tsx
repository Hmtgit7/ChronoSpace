'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PenSquare, FileText, Rss, LogOut, Feather, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { getInitials, cn } from '@/lib/utils';

const NAV = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Blogs', href: '/dashboard/blogs', icon: FileText, exact: false },
    { label: 'New Blog', href: '/dashboard/new', icon: PenSquare, exact: true },
    { label: 'Public Feed', href: '/feed', icon: Rss, exact: true },
];

interface SidebarContentProps {
    onNavigate?: () => void;
}

export default function SidebarContent({ onNavigate }: SidebarContentProps) {
    const { user, clearAuth } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border flex-shrink-0">
                <Link href="/" className="flex items-center gap-2.5" onClick={onNavigate}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
                        <Feather className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-base">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 py-2">
                    Navigation
                </p>
                {NAV.map(({ label, href, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                        >
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-primary')} />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 text-primary/60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-3 border-t border-border space-y-1 flex-shrink-0">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/60">
                    <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                        {getInitials(user?.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">@{user?.username}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
