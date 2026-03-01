interface PasswordStrengthProps {
    password: string;
}

const LEVELS = ['', 'Weak', 'Fair', 'Strong'];
const COLORS = ['', 'bg-destructive', 'bg-amber-400', 'bg-green-500'];

export function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const strength =
        password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 4 ? 1 : 0;

    return (
        <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((lvl) => (
                    <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= lvl ? COLORS[strength] : 'bg-border'
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">
                {LEVELS[strength]}
            </span>
        </div>
    );
}
