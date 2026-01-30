'use client';

import ProtectedLayout from '@/components/ProtectedLayout';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    History,
    LogOut,
    ChevronRight,
    Menu as MenuIcon,
    X,
    Package,
    FileText,
    Store,
    Users as UsersIcon,
    Box,
    Scale,
    Wallet,
    Shapes,
    CalendarClock,
    Filter,
    ArrowRightLeft,
    Clock,
    Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SubMenuItem {
    name: string;
    href: string;
}

interface MenuItem {
    name: string;
    icon: any;
    href?: string;
    subItems?: SubMenuItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const toggleMenu = (name: string) => {
        setExpandedMenus(prev =>
            prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
        );
    };

    const menuItems: MenuItem[] = [
        { name: 'Ringkasan', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Input Penjualan (POS)', icon: ShoppingBag, href: '/admin/sales' },
        { name: 'Riwayat Transaksi', icon: History, href: '/admin/history' },
        {
            name: 'Inventori Produk',
            icon: Package,
            subItems: [
                { name: 'Kelola Produk', href: '/admin/products' },
                { name: 'Bulk Update', href: '/admin/inventory/bulk' },
                { name: 'Bahan Baku', href: '/admin/inventory/materials' },
                { name: 'Harga Modal', href: '/admin/inventory/costs' },
                { name: 'Harga Grosir', href: '/admin/inventory/wholesale' },
                { name: 'Kadaluarsa', href: '/admin/inventory/expiry' },
            ]
        },
        {
            name: 'Laporan',
            icon: FileText,
            subItems: [
                { name: 'Periode', href: '/admin/reports/period' },
                { name: 'Perputaran Stok', href: '/admin/reports/turnover' },
            ]
        },
        {
            name: 'Kelola Outlet',
            icon: Store,
            subItems: [
                { name: 'Outlet Utama', href: '/admin/outlets/main' },
                { name: 'Outlet Cabang', href: '/admin/outlets/branch' },
            ]
        },
        {
            name: 'Pegawai',
            icon: UsersIcon,
            subItems: [
                { name: 'Otorisasi Akses', href: '/admin/employees/access' },
                { name: 'Absensi', href: '/admin/employees/attendance' },
                { name: 'Penugasan', href: '/admin/employees/tasks' },
            ]
        },
    ];

    useEffect(() => {
        menuItems.forEach(item => {
            if (item.subItems?.some(si => pathname === si.href) && !expandedMenus.includes(item.name)) {
                setExpandedMenus(prev => [...prev, item.name]);
            }
        });
    }, [pathname]);

    const findActiveItem = () => {
        for (const item of menuItems) {
            if (item.href === pathname) return item;
            const si = item.subItems?.find(s => s.href === pathname);
            if (si) return { ...item, name: si.name };
        }
        return menuItems[0];
    };

    const activeItemData = findActiveItem();

    return (
        <ProtectedLayout>
            <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-kopi-primary text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shadow-2xl border-r border-white/5
        `}>
                    <div className="p-6 flex items-center justify-between border-b border-white/5">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="bg-white p-1.5 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                                <span className="text-kopi-primary font-black text-xl">E</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-black font-display tracking-tight text-white leading-none">Example Coffe</h1>
                                <p className="text-[8px] text-kopi-cream/60 uppercase tracking-[0.2em] font-bold mt-1">POS & Inventory</p>
                            </div>
                        </Link>
                        <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                        {menuItems.map((item) => {
                            const hasSubItems = !!item.subItems;
                            const isExpanded = expandedMenus.includes(item.name);
                            const isDirectActive = pathname === item.href;
                            const isSubActive = item.subItems?.some(si => pathname === si.href);

                            return (
                                <div key={item.name} className="space-y-0.5">
                                    {hasSubItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isSubActive ? 'bg-white/10 text-white' : 'text-kopi-cream/70 hover:bg-white/5 hover:text-white'}
                      `}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className={`h-4 w-4 ${isSubActive ? 'text-white' : 'text-kopi-cream/50 group-hover:text-white'}`} />
                                                <span className="font-bold text-xs">{item.name}</span>
                                            </div>
                                            <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href!}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`
                        flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isDirectActive
                                                    ? 'bg-white text-kopi-primary shadow-lg scale-[1.02]'
                                                    : 'text-kopi-cream/70 hover:bg-white/5 hover:text-white'
                                                }
                      `}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className={`h-4 w-4 ${isDirectActive ? 'text-kopi-primary' : 'text-kopi-cream/50 group-hover:text-white'}`} />
                                                <span className="font-bold text-xs">{item.name}</span>
                                            </div>
                                        </Link>
                                    )}

                                    {hasSubItems && isExpanded && (
                                        <div className="pl-10 pr-2 space-y-0.5 mt-0.5 animate-fadeIn">
                                            {item.subItems!.map((sub) => {
                                                const isSubItemActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        onClick={() => setIsSidebarOpen(false)}
                                                        className={`
                               flex items-center px-4 py-2 rounded-lg text-[10px] font-bold transition-all duration-200
                               ${isSubItemActive
                                                                ? 'text-white bg-white/10'
                                                                : 'text-kopi-cream/50 hover:text-white hover:bg-white/5'
                                                            }
                            `}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/5 bg-black/10">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-4 py-3 w-full text-[10px] font-black rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 uppercase tracking-widest"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
                    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8 border-b border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <button
                                className="md:hidden p-1.5 rounded-lg bg-gray-50 text-gray-600"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <MenuIcon className="h-5 w-5" />
                            </button>
                            <div className="flex flex-col">
                                <h2 className="text-sm font-black text-gray-800 font-display flex items-center space-x-2">
                                    <activeItemData.icon className="h-4 w-4 text-kopi-primary" />
                                    <span>{activeItemData.name}</span>
                                </h2>
                                <div className="flex items-center space-x-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                    <span>Admin</span>
                                    <ChevronRight className="h-2 w-2" />
                                    <span className="text-kopi-primary italic">{activeItemData.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex flex-col items-end text-right">
                                <span className="text-xs font-black text-gray-800 leading-none">Management Power</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 italic flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" /> Live Data
                                </span>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-kopi-primary to-kopi-secondary flex items-center justify-center text-white font-black text-sm shadow-md">
                                E
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-gray-50/50">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedLayout>
    );
}
