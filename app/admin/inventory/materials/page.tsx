'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    Box,
    Plus,
    Trash2,
    Loader2,
    X,
    Check,
    Scale,
    Edit
} from 'lucide-react';

interface Material {
    id: string;
    name: string;
    unit: string;
    stock: number;
}

export default function MaterialsPage() {
    const { user } = useAuth();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        unit: 'kg',
        stock: 0
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(collection(db, 'bahan_baku'), (snapshot) => {
            setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[]);
            setLoading(false);
        }, (error) => {
            console.error("Materials Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingMaterial) {
                await updateDoc(doc(db, 'bahan_baku', editingMaterial.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'bahan_baku'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving material:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', unit: 'kg', stock: 0 });
        setEditingMaterial(null);
    };

    const deleteMaterial = async (id: string) => {
        if (confirm("Hapus bahan baku ini?")) {
            await deleteDoc(doc(db, 'bahan_baku', id));
        }
    };

    const openEdit = (m: Material) => {
        setEditingMaterial(m);
        setFormData({
            name: m.name ?? '',
            unit: m.unit ?? 'kg',
            stock: m.stock ?? 0
        });
        setIsModalOpen(true);
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                        <Scale className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Manajemen Bahan Baku</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Stok & Inventori Dapur</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="px-6 py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Bahan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {materials.map((m) => (
                    <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group relative">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-kopi-cream group-hover:text-kopi-primary transition-all">
                                <Box className="h-6 w-6" />
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => openEdit(m)} className="p-2 text-gray-300 hover:text-kopi-primary transition-colors">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteMaterial(m.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-gray-800">{m.name}</h4>
                            <div className="flex items-end justify-between">
                                <div className="flex items-center space-x-2">
                                    <p className="text-3xl font-black text-kopi-primary">{m.stock}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.unit}</p>
                                </div>
                                {m.stock < 5 && (
                                    <span className="text-[8px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full uppercase">Stok Menipis</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl animate-slideUp">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black italic">{editingMaterial ? 'Edit Bahan' : 'Tambah Bahan Baru'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nama Bahan</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        placeholder="Contoh: Biji Kopi Arabika"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Satuan Ukur</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        >
                                            <option value="kg">kilogram (kg)</option>
                                            <option value="gr">gram (gr)</option>
                                            <option value="ml">mililiter (ml)</option>
                                            <option value="liter">liter (L)</option>
                                            <option value="pcs">pieces (pcs)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Stok Saat Ini</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    <span>{editingMaterial ? 'Simpan Perubahan' : 'Simpan Bahan'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
