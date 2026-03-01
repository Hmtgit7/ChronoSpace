import Link from 'next/link';
import { Feather } from 'lucide-react';

interface AuthPanelProps {
    heading: string;
    subheading: string;
    bullets: string[];
}

export function AuthPanel({ heading, subheading, bullets }: AuthPanelProps) {
    return (
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-muted/50 border-r border-border">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
                    <Feather className="w-4.5 h-4.5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">
                    Chrono<span className="text-primary">Space</span>
                </span>
            </Link>

            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold leading-tight mb-3">{heading}</h2>
                    <p className="text-muted-foreground leading-relaxed">{subheading}</p>
                </div>
                <ul className="space-y-3">
                    {bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {b}
                        </li>
                    ))}
                </ul>
            </div>

            <p className="text-xs text-muted-foreground/60">
                © {new Date().getFullYear()} ChronoSpace. All rights reserved.
            </p>
        </div>
    );
}
