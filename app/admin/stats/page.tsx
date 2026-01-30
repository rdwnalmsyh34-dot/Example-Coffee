'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    where
} from 'firebase/firestore';
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    Loader2,
    BarChart3,
    PieChart,
    Calendar,
    ChevronDown,
    Tag
} from 'lucide-react';

interface SaleRecord {
    total: number;
    subtotal: number;
    discount?: { amount: number };
    timestamp: Timestamp;
}

export default function StatsPage() {
    const { user } = useAuth();
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        let q = query(collection(db, 'penjualan'), orderBy('timestamp', 'desc'));

        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));

        if (period === 'today') {
            q = query(collection(db, 'penjualan'), where('timestamp', '>=', Timestamp.fromDate(today)), orderBy('timestamp', 'desc'));
        } else if (period === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            q = query(collection(db, 'penjualan'), where('timestamp', '>=', Timestamp.fromDate(weekAgo)), orderBy('timestamp', 'desc'));
        } else if (period === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            q = query(collection(db, 'penjualan'), where('timestamp', '>=', Timestamp.fromDate(monthAgo)), orderBy('timestamp', 'desc'));
        }

        const unsub = onSnapshot(q, (snapshot) => {
            setSales(snapshot.docs.map(doc => doc.data()) as SaleRecord[]);
            setLoading(false);
        }, (error) => {
            console.error("Stats Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [period, user]);

    const totalRevenue = sales.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalDiscount = sales.reduce((acc, s) => acc + (s.discount?.amount || 0), 0);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn font-sans">
            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Analisis Performa</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Laporan Penjualan Realtime</p>
                    </div>
                </div>

                <div className="flex items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    {[
                        { id: 'today', label: 'Hari Ini' },
                        { id: 'week', label: '7 Hari' },
                        { id: 'month', label: '30 Hari' },
                        { id: 'all', label: 'Semua' }
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => { setLoading(true); setPeriod(p.id as any); }}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p.id
                                ? 'bg-kopi-primary text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Pendapatan', value: `Rp ${(totalRevenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
                    { label: 'Total Pesanan', value: totalOrders.toString(), icon: ShoppingBag, color: 'from-orange-500 to-orange-600' },
                    { label: 'Rerata Nota', value: `Rp ${(avgOrderValue || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`, icon: PieChart, color: 'from-purple-500 to-purple-600' },
                    { label: 'Total Diskon', value: `Rp ${(totalDiscount || 0).toLocaleString('id-ID')}`, icon: Tag, color: 'from-emerald-500 to-emerald-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] -mr-6 -mt-6 rounded-full group-hover:scale-125 transition-transform duration-500`} />
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg w-fit mb-6`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
                        <h3 className="text-xl font-black text-gray-800 font-display">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-6 h-96 relative group overflow-hidden">
                    <div className="absolute top-10 left-10 flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 font-display italic">Tren Volume</h3>
                    </div>
                    <BarChart3 className="h-20 w-20 text-gray-200" />
                    <div className="text-center">
                        <p className="text-lg font-black text-gray-400 font-display italic">Grafik Visualisasi</p>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-[0.2em]">Data periodik {period} sedang dianalisis...</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-96">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-500">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 font-display italic">Estimasi Peforma</h3>
                    </div>
                    <div className="space-y-8 flex-1 flex flex-col justify-center">
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Periode</span>
                                <span className="text-xl font-black text-gray-800">88%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-kopi-primary to-kopi-secondary w-[88%] shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Growth {period}</span>
                                <span className="text-xl font-black text-emerald-500">+12.4%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[65%] shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
