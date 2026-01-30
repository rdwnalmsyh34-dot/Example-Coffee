'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else if (user && pathname === '/admin/login') {
                router.push('/admin/dashboard');
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kopi-primary"></div>
            </div>
        );
    }

    // Strict Guard: If no user and not on login page, don't show children while redirecting
    if (!user && pathname !== '/admin/login') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kopi-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
