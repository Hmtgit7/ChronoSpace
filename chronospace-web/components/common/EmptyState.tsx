import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; href: string };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-20 text-center px-4', className)}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-primary/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
            )}
            {action && (
                <Link
                    href={action.href}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}
