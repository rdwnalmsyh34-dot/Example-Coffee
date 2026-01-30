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
    Shapes,
    Search,
    Loader2,
    Tag,
    Zap
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    wholesalePrice?: number;
    isWholesaleActive?: boolean;
}

export default function WholesalePage() {
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
            console.error("Wholesale Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const updateWholesale = async (id: string, updates: any) => {
        try {
            const productRef = doc(db, 'produk', id);
            await updateDoc(productRef, updates);
        } catch (error) {
            console.error("Error updating wholesale:", error);
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
                        <Shapes className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Pengaturan Harga Grosir</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Diskon Volume & Harga Khusus</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari produk untuk harga grosir..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                    <div key={p.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 ${p.isWholesaleActive ? 'border-kopi-primary shadow-lg shadow-kopi-primary/5' : 'border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black text-gray-800 leading-tight pr-4">{p.name}</h4>
                            <button
                                onClick={() => updateWholesale(p.id, { isWholesaleActive: !p.isWholesaleActive })}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${p.isWholesaleActive ? 'bg-kopi-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {p.isWholesaleActive ? 'Grosir Aktif' : 'Non-Grosir'}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Normal</p>
                                    <p className="text-lg font-black text-gray-700">Rp {(p.price || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all ${p.isWholesaleActive ? 'bg-kopi-cream/30 border-kopi-primary/20' : 'bg-white border-gray-50'}`}>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                        <Zap className="h-3 w-3 mr-1" /> Harga Grosir
                                    </p>
                                    <input
                                        type="number"
                                        disabled={!p.isWholesaleActive}
                                        placeholder="0"
                                        defaultValue={p.wholesalePrice || 0}
                                        onBlur={(e) => updateWholesale(p.id, { wholesalePrice: Number(e.target.value) })}
                                        className="bg-transparent font-black text-lg text-kopi-primary outline-none w-full disabled:opacity-30"
                                    />
                                </div>
                            </div>

                            {p.isWholesaleActive && p.wholesalePrice && (
                                <div className="bg-emerald-50 p-4 rounded-2xl flex items-center space-x-3 text-emerald-600">
                                    <Tag className="h-4 w-4" />
                                    <p className="text-[10px] font-black uppercase tracking-wide">
                                        Selisih: Rp {((p.price || 0) - (p.wholesalePrice || 0)).toLocaleString('id-ID')} Per Item
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
