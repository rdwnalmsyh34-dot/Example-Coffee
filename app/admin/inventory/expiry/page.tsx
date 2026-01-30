'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc
} from 'firebase/firestore';
import {
    CalendarDays,
    Search,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    expiryDate?: string;
}

export default function ExpiryPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'produk'), orderBy('name', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            setLoading(false);
        }, (error) => {
            console.error("Expiry Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const updateExpiry = async (id: string, date: string) => {
        try {
            const productRef = doc(db, 'produk', id);
            await updateDoc(productRef, { expiryDate: date });
        } catch (error) {
            console.error("Error updating expiry:", error);
        }
    };

    const getExpiryStatus = (dateStr?: string) => {
        if (!dateStr) return { label: 'Belum Diatur', color: 'bg-gray-100 text-gray-400', icon: Clock };

        const expiryDate = new Date(dateStr);
        const today = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { label: 'Kadaluarsa', color: 'bg-red-500 text-white', icon: AlertTriangle };
        if (diffDays <= 7) return { label: 'Mendekati (7 Hari)', color: 'bg-orange-500 text-white', icon: AlertTriangle };
        return { label: 'Aman', color: 'bg-emerald-500 text-white', icon: CheckCircle2 };
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Monitoring Kadaluarsa</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Kontrol Kualitas & Keamanan</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari item di pantauan..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => {
                    const status = getExpiryStatus(p.expiryDate);
                    const StatusIcon = status.icon;

                    return (
                        <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${status.color}`}>
                                    <StatusIcon className="h-3 w-3" />
                                    <span>{status.label}</span>
                                </div>
                            </div>

                            <h4 className="text-sm font-black text-gray-800 mb-6 min-h-[40px] leading-tight">{p.name}</h4>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tgl Kadaluarsa</label>
                                <input
                                    type="date"
                                    value={p.expiryDate || ''}
                                    onChange={(e) => updateExpiry(p.id, e.target.value)}
                                    className="w-full bg-transparent font-black text-xs text-kopi-primary outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
