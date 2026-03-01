import Link from "next/link";
import { Feather, Github } from "lucide-react";

const FOOTER_LINKS = [
    { label: "Feed", href: "/feed" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
];

export function Footer() {
    return (
        <footer className="border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <Feather className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">
                            Chrono<span className="text-primary">Space</span>
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                        {FOOTER_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="hover:text-foreground transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-muted-foreground/60">
                        © {new Date().getFullYear()} ChronoSpace
                    </p>
                </div>
            </div>
        </footer>
    );
}
