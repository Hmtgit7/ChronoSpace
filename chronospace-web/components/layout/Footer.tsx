import Link from 'next/link';
import { Feather, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <Feather className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold">
                            Chrono<span className="text-primary">Space</span>
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Built with Next.js 15 & NestJS · {new Date().getFullYear()}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="/feed" className="hover:text-foreground transition-colors">Feed</Link>
                        <a
                            href="https://github.com/Hmtgit7/ChronoSpace"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
