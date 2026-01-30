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
    addDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    Coffee,
    Edit3,
    EyeOff,
    Search,
    Tag,
    Loader2,
    PackageCheck,
    LayoutGrid,
    Plus,
    Trash2,
    X,
    Check,
    AlertCircle
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    stock: number;
    category: string;
    isActive: boolean;
    image: string;
}

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Coffee',
        price: 0,
        costPrice: 0,
        stock: 0,
        isActive: true,
        image: ''
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'produk'), orderBy('category', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            setLoading(false);
        }, (error) => {
            console.error("Products Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Coffee',
            price: 0,
            costPrice: 0,
            stock: 0,
            isActive: true,
            image: ''
        });
        setEditingProduct(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({
            name: p.name ?? '',
            category: p.category ?? 'Coffee',
            price: p.price ?? 0,
            costPrice: p.costPrice ?? 0,
            stock: p.stock ?? 0,
            isActive: p.isActive ?? true,
            image: p.image ?? ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                const productRef = doc(db, 'produk', editingProduct.id);
                await updateDoc(productRef, {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'produk'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                await deleteDoc(doc(db, 'produk', id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleProductStatus = async (id: string, currentStatus: boolean) => {
        try {
            const productRef = doc(db, 'produk', id);
            await updateDoc(productRef, { isActive: !currentStatus });
        } catch (error) {
            console.error("Error updating product status:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari nama produk..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <div className="hidden sm:block bg-white text-gray-400 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-gray-100 italic">
                        {products.length} Items Katalog
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="px-6 py-3.5 bg-kopi-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Produk Baru</span>
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center space-x-4">
                    <div className="p-2.5 bg-kopi-cream rounded-xl text-kopi-primary">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 font-display italic">Katalog Produk Realtime</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-50 bg-gray-50/30">
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Nama & Detail</th>
                                <th className="px-8 py-5">Kategori</th>
                                <th className="px-8 py-5">Harga (Modal/Jual)</th>
                                <th className="px-8 py-5">Stok</th>
                                <th className="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${!p.isActive ? 'opacity-40 grayscale' : ''}`}>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleProductStatus(p.id, p.isActive)}
                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${p.isActive
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-red-50 text-red-500 border border-red-100'
                                                }`}
                                        >
                                            {p.isActive ? (
                                                <><PackageCheck className="h-3 w-3" /> <span>Aktif</span></>
                                            ) : (
                                                <><EyeOff className="h-3 w-3" /> <span>Nonaktif</span></>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-black text-kopi-primary text-xs shadow-sm uppercase">
                                                {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-tight">{p.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter italic">ID: {p.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center space-x-1.5 text-[10px] font-black text-gray-400 italic">
                                            <Tag className="h-3 w-3" />
                                            <span>{p.category}</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-kopi-secondary">Rp {(p.price || 0).toLocaleString('id-ID')}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase italic">Modal: Rp {(p.costPrice || 0).toLocaleString('id-ID')}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-sm font-black ${(p.stock || 0) < 10 ? 'text-orange-500' : 'text-gray-700'}`}>
                                            {p.stock || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-kopi-primary hover:text-white transition-all border border-gray-100"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-gray-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-slideUp">
                        <div className="bg-kopi-primary p-6 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Coffee className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-black italic font-display">
                                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nama Lengkap Produk</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-kopi-primary outline-none font-bold text-sm"
                                        placeholder="Contoh: Es Kopi Susu Aren"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Kategori / Series</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-kopi-primary outline-none font-bold text-sm"
                                    >
                                        <option value="Coffee">Coffee</option>
                                        <option value="Non-Coffee">Non-Coffee</option>
                                        <option value="Snack">Snack</option>
                                        <option value="Manual Brew">Manual Brew</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Status Katalog</label>
                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: true })}
                                            className={`flex-1 py-2.5 rounded-lg font-black text-[10px] transition-all ${formData.isActive ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}
                                        >
                                            AKTIF
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: false })}
                                            className={`flex-1 py-2.5 rounded-lg font-black text-[10px] transition-all ${!formData.isActive ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                                        >
                                            NONAKTIF
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Harga Modal (Rp)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: parseInt(e.target.value) || 0 })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-kopi-primary outline-none font-bold text-sm"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Harga Jual (Rp)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-kopi-primary outline-none font-bold text-sm"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center space-x-4">
                                        <div className="p-3 bg-white rounded-xl text-orange-500">
                                            <Box className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] block mb-1">Stok Awal Inventori</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent border-b-2 border-orange-200 outline-none font-black text-lg text-orange-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Path Gambar (SVG)</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-kopi-primary outline-none font-bold text-sm"
                                        placeholder="Contoh: /images/Kopi Susu.svg"
                                    />
                                    <p className="text-[8px] text-gray-400 mt-2 italic px-1">Gunakan path relatif seperti: /images/nama-produk.svg</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-[10px] font-bold">Data akan tersimpan secara realtime</span>
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="px-10 py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-kopi-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    <span>{editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Subheader icon for the form
function Box({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    )
}
