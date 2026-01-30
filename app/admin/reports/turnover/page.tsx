'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Loader2,
    Package,
    ArrowRight
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    stock: number;
}

interface Transaction {
    item: string;
    quantity: number;
    productId?: string;
}

export default function StockTurnoverPage() {
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
        }, (error) => {
            console.error("Turnover Products Error:", error);
        });

        const unsubTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(500)), (snapshot) => {
            setTransactions(snapshot.docs.map(doc => doc.data()) as Transaction[]);
            setLoading(false);
        }, (error) => {
            console.error("Turnover Transactions Error:", error);
            setLoading(false);
        });

        return () => {
            unsubProducts();
            unsubTransactions();
        };
    }, [user]);

    const getAnalytics = () => {
        const salesMap: Record<string, number> = {};
        transactions.forEach(t => {
            salesMap[t.item] = (salesMap[t.item] || 0) + (t.quantity || 0);
        });

        const combined = products.map(p => ({
            ...p,
            soldCount: salesMap[p.name] || 0,
            velocity: (salesMap[p.name] || 0) / Math.max(1, p.stock)
        })).sort((a, b) => b.soldCount - a.soldCount);

        return combined;
    };

    const analytics = getAnalytics();
    const fastMoving = analytics.slice(0, 5);
    const slowMoving = [...analytics].reverse().slice(0, 5);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                    <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-800 font-display italic">Analisis Perputaran Stok</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Optimalisasi Inventory & Sales Velocity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Fast Moving */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-500 bg-emerald-50 w-fit px-4 py-2 rounded-xl">
                        <TrendingUp className="h-4 w-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Fast Moving Items</h4>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        {fastMoving.map((p, i) => (
                            <div key={p.id} className="p-6 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center font-black text-xs italic">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-sm">{p.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Stok: {p.stock} | Terjual: {p.soldCount}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-black text-emerald-600">Sangat Cepat</span>
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[90%]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slow Moving */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-orange-500 bg-orange-50 w-fit px-4 py-2 rounded-xl">
                        <TrendingDown className="h-4 w-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Slow Moving Items</h4>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        {slowMoving.map((p, i) => (
                            <div key={p.id} className="p-6 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-black text-xs italic">
                                        #{analytics.length - i}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-sm">{p.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Stok: {p.stock} | Terjual: {p.soldCount}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-black text-orange-400">Lambat</span>
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[20%]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="bg-kopi-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
                    <div className="space-y-2">
                        <p className="text-kopi-cream/60 text-[10px] font-bold uppercase tracking-[0.2em]">Rekomendasi Strategi</p>
                        <h4 className="text-2xl font-black italic font-display">Optimalkan Stok Anda</h4>
                        <p className="text-sm text-kopi-cream/80 max-w-md">Item Fast Moving perlu restok lebih awal untuk menghindari out-of-stock. Pertimbangkan promo bundling untuk item Slow Moving.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-kopi-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-3">
                        <span>Lihat Panduan Restok</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
            </div>
        </div>
    );
}
