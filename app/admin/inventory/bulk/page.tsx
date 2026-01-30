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
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import {
    Package,
    Search,
    Loader2,
    Check,
    AlertCircle,
    Save,
    Edit2
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
}

export default function BulkUpdatePage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bulk inputs
    const [bulkPrice, setBulkPrice] = useState<number | ''>('');
    const [bulkStock, setBulkStock] = useState<number | ''>('');

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
            console.error("Bulk Update Products Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === filteredProducts.length) setSelectedIds([]);
        else setSelectedIds(filteredProducts.map(p => p.id));
    };

    const handleBulkUpdate = async () => {
        if (selectedIds.length === 0) return;
        if (bulkPrice === '' && bulkStock === '') return;

        setIsSubmitting(true);
        try {
            const batch = writeBatch(db);
            selectedIds.forEach(id => {
                const productRef = doc(db, 'produk', id);
                const updateData: any = { updatedAt: serverTimestamp() };
                if (bulkPrice !== '') updateData.price = Number(bulkPrice);
                if (bulkStock !== '') updateData.stock = Number(bulkStock);
                batch.update(productRef, updateData);
            });
            await batch.commit();
            setSelectedIds([]);
            setBulkPrice('');
            setBulkStock('');
            alert("Berhasil memperbarui data produk secara massal.");
        } catch (error) {
            console.error("Error bulk updating:", error);
            alert("Gagal memperbarui data.");
        } finally {
            setIsSubmitting(false);
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
            {/* Search & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari produk untuk update massal..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 bg-kopi-cream/30 p-4 rounded-3xl border border-kopi-primary/10 animate-slideDown">
                        <div className="px-4 py-2 bg-kopi-primary text-white rounded-xl text-[10px] font-black uppercase">
                            {selectedIds.length} Terpilih
                        </div>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                placeholder="Set Harga Baru..."
                                value={bulkPrice}
                                onChange={e => setBulkPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="px-4 py-2.5 rounded-xl border border-gray-100 text-xs font-bold w-32 outline-none focus:ring-2 focus:ring-kopi-primary"
                            />
                            <input
                                type="number"
                                placeholder="Set Stok Baru..."
                                value={bulkStock}
                                onChange={e => setBulkStock(e.target.value === '' ? '' : Number(e.target.value))}
                                className="px-4 py-2.5 rounded-xl border border-gray-100 text-xs font-bold w-32 outline-none focus:ring-2 focus:ring-kopi-primary"
                            />
                            <button
                                onClick={handleBulkUpdate}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                <span>Update</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-50 bg-gray-50/30">
                            <th className="px-8 py-5 w-20">
                                <button onClick={selectAll} className="p-1.5 rounded-lg border-2 border-gray-200 hover:border-kopi-primary transition-colors">
                                    <Check className={`h-3 w-3 ${selectedIds.length === filteredProducts.length ? 'text-kopi-primary' : 'text-transparent'}`} />
                                </button>
                            </th>
                            <th className="px-8 py-5">Nama Produk</th>
                            <th className="px-8 py-5">Kategori</th>
                            <th className="px-8 py-5">Harga Sekarang</th>
                            <th className="px-8 py-5">Stok Sekarang</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((p) => (
                            <tr
                                key={p.id}
                                className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedIds.includes(p.id) ? 'bg-kopi-cream/10' : ''}`}
                                onClick={() => toggleSelect(p.id)}
                            >
                                <td className="px-8 py-6">
                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedIds.includes(p.id) ? 'border-kopi-primary bg-kopi-primary' : 'border-gray-200'}`}>
                                        {selectedIds.includes(p.id) && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-gray-800 text-sm">{p.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">ID: {p.id.slice(0, 8)}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{p.category}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-kopi-secondary text-sm">Rp {(p.price || 0).toLocaleString('id-ID')}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className={`font-black text-sm ${p.stock < 10 ? 'text-orange-500' : 'text-gray-700'}`}>{p.stock || 0}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
