'use client';
import Link from 'next/link';
import { getInitials, cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, PenSquare, FileText, Rss,
    LogOut, Feather, ChevronRight,
    User,
} from 'lucide-react';
import { useState } from 'react';


const NAV = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Blogs', href: '/dashboard/blogs', icon: FileText },
    { label: 'New Blog', href: '/dashboard/new', icon: PenSquare },
    { label: 'Public Feed', href: '/feed', icon: Rss },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];
export default function SidebarContent() {
    const { user, clearAuth } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                        <Feather className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-base">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
                    Menu
                </p>
                {NAV.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href) && href !== '/feed');
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                                active
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                        >
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-primary')} />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3 h-3 text-primary" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                        {user?.username ? getInitials(user.username) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">@{user?.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}