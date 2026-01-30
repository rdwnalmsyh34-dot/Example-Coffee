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
    updateDoc,
    increment
} from 'firebase/firestore';
import {
    Box,
    Plus,
    Minus,
    Search,
    Loader2,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    stock: number;
    category: string;
}

export default function StockPage() {

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
            console.error("Stock Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const adjustStock = async (id: string, amount: number) => {
        try {
            const productRef = doc(db, 'produk', id);
            await updateDoc(productRef, {
                stock: increment(amount)
            });
        } catch (error) {
            console.error("Error adjusting stock:", error);
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
            {/* Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari item untuk update stok..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stock List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-kopi-cream rounded-xl flex items-center justify-center text-kopi-primary">
                                    <Box className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-800 text-sm leading-tight">{p.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{p.category}</p>
                                </div>
                            </div>
                            {(p.stock || 0) < 10 && (
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg" title="Stok Menipis">
                                    <AlertTriangle className="h-4 w-4" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stok Saat Ini</p>
                                <p className={`text-3xl font-black ${p.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>{p.stock || 0}</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => adjustStock(p.id, -1)}
                                    className="p-3 bg-white text-gray-400 rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 shadow-sm"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => adjustStock(p.id, 1)}
                                    className="p-3 bg-white text-gray-400 rounded-xl border border-gray-100 hover:bg-emerald-50 hover:text-emerald-500 transition-all active:scale-95 shadow-sm"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                                <div className="w-10" />
                                <button
                                    onClick={() => {
                                        const val = prompt("Masukkan jumlah stok baru:", p.stock.toString());
                                        if (val !== null) {
                                            const newStock = parseInt(val);
                                            if (!isNaN(newStock)) {
                                                const productRef = doc(db, 'produk', p.id);
                                                updateDoc(productRef, { stock: newStock });
                                            }
                                        }
                                    }}
                                    className="p-3 bg-kopi-primary text-white rounded-xl shadow-lg shadow-kopi-primary/20 hover:scale-105 transition-all"
                                >
                                    <TrendingUp className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
