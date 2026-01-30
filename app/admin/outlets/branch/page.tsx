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
    Plus,
    Trash2,
    Loader2,
    X,
    Check,
    MapPin,
    Store,
    Phone,
    Power
} from 'lucide-react';

interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    isActive: boolean;
}

export default function BranchPage() {
    const { user } = useAuth();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        isActive: true
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(collection(db, 'cabang'), (snapshot) => {
            setBranches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Branch[]);
            setLoading(false);
        }, (error) => {
            console.error("Branch Page Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'cabang'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
            setFormData({ name: '', address: '', phone: '', isActive: true });
        } catch (error) {
            console.error("Error saving branch:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteBranch = async (id: string) => {
        if (confirm("Hapus data cabang ini?")) {
            await deleteDoc(doc(db, 'cabang', id));
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await updateDoc(doc(db, 'cabang', id), { isActive: !current });
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
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Manajemen Cabang</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ekspansi & Kontrol Lokasi</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Cabang</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map((b) => (
                    <div key={b.id} className={`bg-white rounded-[2.5rem] p-8 border transition-all duration-300 ${b.isActive ? 'border-gray-100 shadow-sm' : 'border-red-50 grayscale opacity-60'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${b.isActive ? 'bg-kopi-cream text-kopi-primary' : 'bg-gray-100 text-gray-400'}`}>
                                <Store className="h-6 w-6" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => toggleStatus(b.id, b.isActive)}
                                    className={`p-3 rounded-xl transition-all ${b.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-400 hover:bg-emerald-500 hover:text-white'}`}
                                    title={b.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                    <Power className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteBranch(b.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-black text-gray-800 font-display">{b.name}</h4>
                                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${b.isActive ? 'text-emerald-500' : 'text-red-400'}`}>
                                    {b.isActive ? 'Operasional Aktif' : 'Tutup Sementara'}
                                </p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-50">
                                <div className="flex items-start space-x-3 text-gray-400">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <p className="text-xs font-medium leading-relaxed">{b.address}</p>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-400">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <p className="text-xs font-bold">{b.phone}</p>
                                </div>
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
                                <h3 className="text-xl font-black italic">Daftarkan Cabang Baru</h3>
                                <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nama Cabang / Lokasi</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        placeholder="Contoh: Example Coffe Sudirman"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nomor Telepon</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        placeholder="021..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Alamat Lengkap</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm resize-none"
                                        placeholder="Jl. Raya..."
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    <span>Daftarkan Cabang</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
