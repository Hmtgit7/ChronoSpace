"use client";
import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface Props {
    targetRef: React.RefObject<HTMLElement | null>;
}

export function ReadingProgress({ targetRef }: Props) {
    const rawProgress = useSpring(0, { stiffness: 120, damping: 25 });
    const scaleX = useTransform(rawProgress, [0, 100], [0, 1]);

    useEffect(() => {
        const calculate = () => {
            const el = targetRef.current;
            if (!el) return;

            const articleTop = el.offsetTop;
            const articleHeight = el.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrolled = window.scrollY - articleTop + windowHeight * 0.15;
            const total = articleHeight - windowHeight * 0.7;

            rawProgress.set(
                Math.min(Math.max((scrolled / total) * 100, 0), 100)
            );
        };

        window.addEventListener("scroll", calculate, { passive: true });
        calculate();
        return () => window.removeEventListener("scroll", calculate);
    }, [targetRef, rawProgress]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-violet-500 to-primary pointer-events-none"
            style={{ scaleX }}
        />
    );
}
