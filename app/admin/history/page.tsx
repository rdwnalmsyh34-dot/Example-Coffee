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
    limit
} from 'firebase/firestore';
import {
    History,
    Search,
    Loader2,
    Clock,
    Download,
    CreditCard,
    Banknote,
    Smartphone,
    ChevronDown,
    ChevronUp,
    Printer
} from 'lucide-react';
import { printer } from '@/lib/printer';

interface TransactionItem {
    name: string;
    qty: number;
    price: number;
    subtotal: number;
}

interface SaleRecord {
    id: string;
    transactionId: string;
    timestamp: Timestamp;
    items: TransactionItem[];
    subtotal: number;
    discount?: {
        name: string;
        amount: number;
    };
    total: number;
    paymentMethod: string;
}

export default function HistoryPage() {
    const { user } = useAuth();
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'penjualan'),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SaleRecord[]);
            setLoading(false);
        }, (error) => {
            console.error("History Page Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredSales = sales.filter(s =>
        s.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDateTime = (ts: Timestamp) => {
        if (!ts) return { date: '-', time: '-' };
        const date = ts.toDate();
        return {
            date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Tunai': return <Banknote className="h-4 w-4" />;
            case 'QRIS': return <CreditCard className="h-4 w-4" />;
            default: return <Smartphone className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari ID transaksi atau produk..."
                        className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white border border-gray-100 shadow-premium focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center space-x-2 px-6 py-4 bg-kopi-primary text-white rounded-3xl shadow-lg shadow-kopi-primary/20 hover:scale-105 transition-all font-bold text-sm">
                    <Download className="h-4 w-4" />
                    <span>Ekspor Laporan</span>
                </button>
            </div>

            {/* Sale History List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-kopi-cream rounded-xl text-kopi-primary">
                            <History className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 font-display italic">Riwayat Penjualan</h3>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredSales.length} Nota Tercatat</p>
                </div>

                <div className="divide-y divide-gray-50">
                    {filteredSales.length > 0 ? (
                        filteredSales.map((sale) => {
                            const { date, time } = formatDateTime(sale.timestamp);
                            const isExpanded = expandedId === sale.id;

                            return (
                                <div key={sale.id} className={`transition-all duration-300 ${isExpanded ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}>
                                    <div
                                        onClick={() => setExpandedId(isExpanded ? null : sale.id)}
                                        className="px-6 md:px-8 py-5 md:py-6 flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-8">
                                            <span className="font-mono text-[10px] font-black text-gray-300 uppercase tracking-tighter w-20">
                                                {sale.transactionId.split('-')[1]}
                                            </span>
                                            <div className="flex items-center space-x-3 w-32">
                                                <Clock className="h-4 w-4 text-gray-300" />
                                                <div>
                                                    <p className="font-black text-gray-800 text-xs">{time}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase">{date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                <div className="text-kopi-primary">{getMethodIcon(sale.paymentMethod)}</div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{sale.paymentMethod}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-8">
                                            <div className="text-right">
                                                <p className="text-lg font-black text-kopi-secondary">Rp {(sale.total || 0).toLocaleString('id-ID')}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{sale.items.length} Item</p>
                                            </div>
                                            {isExpanded ? <ChevronUp className="h-4 w-4 text-kopi-primary" /> : <ChevronDown className="h-4 w-4 text-gray-300" />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-10 pb-10 pt-2 animate-fadeIn">
                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                                                <div className="grid grid-cols-12 gap-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-4">
                                                    <div className="col-span-6">Nama Produk</div>
                                                    <div className="col-span-2 text-center">Qty</div>
                                                    <div className="col-span-2 text-right">Harga</div>
                                                    <div className="col-span-2 text-right">Subtotal</div>
                                                </div>
                                                {sale.items.map((item, idx) => (
                                                    <div key={idx} className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-700">
                                                        <div className="col-span-6">{item.name}</div>
                                                        <div className="col-span-2 text-center">{item.qty}</div>
                                                        <div className="col-span-2 text-right">Rp {(item.price || 0).toLocaleString('id-ID')}</div>
                                                        <div className="col-span-2 text-right text-kopi-primary">Rp {(item.subtotal || 0).toLocaleString('id-ID')}</div>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center pt-6 mt-6 border-t border-dashed border-gray-100">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            printer.print({
                                                                ...sale,
                                                                timestamp: sale.timestamp.toDate(),
                                                                subtotal: sale.subtotal || sale.total, // Fallback to total if subtotal is missing in old records
                                                                discount: sale.discount
                                                            });
                                                        }}
                                                        className="flex items-center space-x-2 px-4 py-3 bg-kopi-cream text-kopi-primary rounded-xl font-black text-xs hover:bg-kopi-primary hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                        <span>Cetak Ulang Nota</span>
                                                    </button>
                                                    <div className="text-right">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-4">Grand Total</span>
                                                        <span className="text-2xl font-black text-kopi-secondary">Rp {(sale.total || 0).toLocaleString('id-ID')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-40 text-center">
                            <div className="flex flex-col items-center space-y-6 opacity-30">
                                <Search className="h-16 w-16" />
                                <p className="text-xl font-black font-display italic text-white">Belum ada nota penjualan.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
