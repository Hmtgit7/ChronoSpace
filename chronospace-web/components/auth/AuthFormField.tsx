import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: ReactNode;
    error?: string;
}

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
    ({ label, icon, error, className, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        {icon}
                    </span>
                    <input
                        ref={ref}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border',
                            'text-sm placeholder:text-muted-foreground/50',
                            'focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all',
                            error && 'border-destructive focus:ring-destructive/15',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
AuthFormField.displayName = 'AuthFormField';
