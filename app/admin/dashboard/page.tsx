'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import {
    BarChart3,
    Users,
    DollarSign,
    ArrowUpRight,
    History,
    Coffee,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price?: number;
}

interface Transaction {
    id: string;
    item: string;
    quantity: number;
    total: number;
    createdAt: Timestamp;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsubProducts = onSnapshot(collection(db, 'produk'), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            setLoading(false);
        }, (error) => {
            console.error("Dashboard Products Error:", error);
            setLoading(false);
        });

        const qTransactions = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(10));
        const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[]);
        }, (error) => {
            console.error("Dashboard Transactions Error:", error);
        });

        return () => {
            unsubProducts();
            unsubTransactions();
        };
    }, [user]);

    const totalSalesVal = transactions.reduce((acc, curr) => acc + curr.total, 0);

    const stats = [
        { name: 'Total Penjualan', value: `Rp ${totalSalesVal.toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-blue-500 to-blue-600', href: '/admin/stats' },
        { name: 'Transaksi Terbaru', value: transactions.length.toString(), icon: History, color: 'from-emerald-500 to-emerald-600', href: '/admin/history' },
        { name: 'Total Produk', value: products.length.toString(), icon: Coffee, color: 'from-orange-500 to-orange-600', href: '/admin/products' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Welcome */}
            <div className="bg-linear-to-r from-kopi-primary to-kopi-secondary rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-kopi-primary/20">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black font-display mb-3 italic">Selamat Datang, Admin!</h1>
                    <p className="max-w-xl text-kopi-cream/80 text-base font-medium leading-relaxed">
                        Kelola operasional Example Coffe hari ini. Pantau stok, catat penjualan, dan lihat statistik performa tokomu dengan data realtime.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href="/admin/sales" className="px-6 py-3 bg-white text-kopi-primary font-black rounded-xl hover:bg-kopi-cream transition-all shadow-md flex items-center space-x-2 text-sm">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Mulai Jualan (POS)</span>
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.name} href={stat.href} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-kopi-primary transition-colors" />
                        </div>
                        <div className="mt-6">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.name}</p>
                            <h3 className="text-xl font-black text-gray-800 mt-2 font-display">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Realtime Feed Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-kopi-cream rounded-xl text-kopi-primary">
                            <History className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 font-display italic">Transaksi Terakhir</h3>
                    </div>
                    <Link href="/admin/history" className="text-xs font-bold text-kopi-primary hover:underline flex items-center space-x-1 uppercase tracking-widest">
                        <span>Lihat Semua</span>
                        <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-kopi-primary shadow-sm group-hover:bg-kopi-primary group-hover:text-white transition-colors duration-300">
                                        {t.item.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-800 text-lg leading-tight">{t.item}</h4>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                            {t.createdAt?.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Qty: {t.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-kopi-secondary">Rp {(t.total || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-400 italic font-bold">
                            Belum ada transaksi tercatat hari ini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
