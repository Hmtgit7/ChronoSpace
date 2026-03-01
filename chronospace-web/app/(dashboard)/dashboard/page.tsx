'use client';
import { motion } from 'framer-motion';
import { useMyBlogs } from '@/lib/hooks/useBlogs';
import { useAuthStore } from '@/lib/store/auth.store';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentBlogs } from '@/components/dashboard/RecentBlogs';
import { QuickWriteCTA } from '@/components/dashboard/QuickWriteCTA';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: blogs, isLoading } = useMyBlogs();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <DashboardHeader username={user?.username} />
            <StatsGrid blogs={blogs} isLoading={isLoading} />
            <RecentBlogs blogs={blogs} isLoading={isLoading} />
            {!isLoading && blogs?.length === 0 && <QuickWriteCTA />}
        </motion.div>
    );
}
