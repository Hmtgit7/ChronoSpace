import { cn } from '@/lib/utils';

interface Props {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', className, fullScreen }: Props) {
    const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

    const spinner = (
        <div className={cn('relative', sizeMap[size], className)}>
            <div className={cn('absolute inset-0 rounded-full border-2 border-primary/20')} />
            <div className={cn(
                'absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin'
            )} />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-4">
                    {spinner}
                    <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    return spinner;
}
