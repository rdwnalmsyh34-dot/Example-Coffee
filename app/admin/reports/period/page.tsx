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
    FileText,
    Calendar,
    Search,
    Loader2,
    DollarSign,
    ShoppingBag,
    Download,
    Filter
} from 'lucide-react';

interface SaleRecord {
    id: string;
    total: number;
    items: any[];
    timestamp: Timestamp;
    paymentMethod: string;
}

export default function PeriodReportPage() {
    const { user } = useAuth();
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        // Default: Last 7 days
        const now = new Date();
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        setStartDate(weekAgo.toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setLoading(false);
    }, []);

    const fetchReports = () => {
        if (!startDate || !endDate || !user) return;
        setLoading(true);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, 'penjualan'),
            where('timestamp', '>=', Timestamp.fromDate(start)),
            where('timestamp', '<=', Timestamp.fromDate(end)),
            orderBy('timestamp', 'desc')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SaleRecord[]);
            setLoading(false);
        }, (error) => {
            console.error("Period Report Error:", error);
            setLoading(false);
        });
        return unsub;
    };

    useEffect(() => {
        const unsub = fetchReports();
        return () => unsub && unsub();
    }, [startDate, endDate, user]);

    const totalRevenue = sales.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalItems = sales.reduce((acc, s) => acc + s.items.length, 0);

    if (loading && sales.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Laporan Filter Periode</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Custom Date Range Analysis</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Dari:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="bg-transparent text-xs font-black text-kopi-primary outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Hingga:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="bg-transparent text-xs font-black text-kopi-primary outline-none"
                        />
                    </div>
                    <button className="p-3 bg-kopi-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6">
                    <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
                        <h4 className="text-lg font-black text-gray-800">Rp {(totalRevenue || 0).toLocaleString('id-ID')}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6">
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items Sold</p>
                        <h4 className="text-lg font-black text-gray-800">{totalItems} Pcs</h4>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider italic">Rincian Transaksi Periode</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-50 bg-gray-50/30">
                                <th className="px-8 py-4">Tanggal & Waktu</th>
                                <th className="px-8 py-4">ID Transaksi</th>
                                <th className="px-8 py-4">Item Count</th>
                                <th className="px-8 py-4">Metode</th>
                                <th className="px-8 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sales.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-black text-gray-800">{s.timestamp?.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{s.timestamp?.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-8 py-5 font-mono text-[10px] font-black text-gray-400 uppercase">
                                        {(s as any).transactionId || s.id.slice(0, 8)}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-bold text-gray-700">{s.items.length} Items</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[9px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-600 uppercase tracking-tighter">
                                            {s.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-kopi-secondary text-sm">
                                        Rp {(s.total || 0).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
