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
    Wallet,
    Search,
    Loader2,
    TrendingDown,
    Percent
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    category: string;
}

export default function CostsPage() {
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
            console.error("Costs Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const updateCost = async (id: string, newCost: number) => {
        try {
            const productRef = doc(db, 'produk', id);
            await updateDoc(productRef, { costPrice: newCost });
        } catch (error) {
            console.error("Error updating cost:", error);
        }
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
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Analisis Harga Modal</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Audit COGS & Margin Profit</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari produk untuk cek margin..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => {
                    const margin = p.price - (p.costPrice || 0);
                    const marginPercent = p.price > 0 ? (margin / p.price) * 100 : 0;

                    return (
                        <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className="bg-gray-50 px-4 py-2 rounded-xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.category}</p>
                                </div>
                                <div className={`flex items-center space-x-1 text-xs font-black ${marginPercent > 40 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    <Percent className="h-3 w-3" />
                                    <span>{marginPercent.toFixed(1)}% Margin</span>
                                </div>
                            </div>

                            <h4 className="text-lg font-black text-gray-800 mb-6">{p.name}</h4>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Modal</p>
                                        <input
                                            type="number"
                                            defaultValue={p.costPrice || 0}
                                            onBlur={(e) => updateCost(p.id, Number(e.target.value))}
                                            className="bg-transparent font-black text-xl text-kopi-primary outline-none border-b-2 border-transparent focus:border-kopi-primary w-24"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Jual</p>
                                        <p className="font-black text-xl text-gray-700">Rp {(p.price || 0).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic flex items-center space-x-2">
                                        <TrendingDown className="h-3 w-3" />
                                        <span>Estimasi Profit:</span>
                                    </span>
                                    <span className="text-sm font-black text-emerald-600">Rp {(margin || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
