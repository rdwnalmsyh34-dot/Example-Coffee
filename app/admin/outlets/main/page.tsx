'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    Store,
    MapPin,
    Phone,
    Clock,
    Loader2,
    Check,
    Edit,
    Info
} from 'lucide-react';

interface Outlet {
    id: string;
    name: string;
    address: string;
    phone: string;
    openHours: string;
    isMain: boolean;
}

export default function OutletMainPage() {
    const { user } = useAuth();
    const [outlet, setOutlet] = useState<Outlet | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        openHours: ''
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        // Assuming 'konfigurasi' collection holds outlet data
        const unsub = onSnapshot(collection(db, 'konfigurasi'), (snapshot) => {
            const main = snapshot.docs.find(d => d.data().isMain === true);
            if (main) {
                setOutlet({ id: main.id, ...main.data() } as Outlet);
                setFormData({
                    name: main.data().name,
                    address: main.data().address,
                    phone: main.data().phone,
                    openHours: main.data().openHours
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Outlet Main Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!outlet) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'konfigurasi', outlet.id), {
                ...formData,
                updatedAt: serverTimestamp()
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating outlet:", error);
        } finally {
            setIsSubmitting(false);
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                        <Store className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Informasi Outlet Utama</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Identitas & Operasional Cabang</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-kopi-primary/20 flex items-center space-x-2"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Informasi</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <div className="bg-kopi-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-8">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                                <Store className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black italic font-display leading-tight">{outlet?.name || 'Example Coffe'}</h4>
                                <p className="text-kopi-cream/60 font-bold uppercase tracking-widest text-[10px] mt-2">Pusat Operasional</p>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center space-x-4 text-kopi-cream/80">
                                    <MapPin className="h-5 w-5" />
                                    <span className="text-sm font-medium">{outlet?.address || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-kopi-cream/80">
                                    <Phone className="h-5 w-5" />
                                    <span className="text-sm font-medium">{outlet?.phone || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-kopi-cream/80">
                                    <Clock className="h-5 w-5" />
                                    <span className="text-sm font-medium">{outlet?.openHours || '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm h-full">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-8 animate-fadeIn">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Nama Outlet</label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Telepon Kantor</label>
                                    <input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Jam Operasional</label>
                                    <input
                                        value={formData.openHours}
                                        onChange={e => setFormData({ ...formData, openHours: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Alamat Lengkap</label>
                                    <textarea
                                        rows={3}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm resize-none"
                                    />
                                </div>
                                <div className="col-span-2 pt-6 flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 flex items-center space-x-3"
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        <span>Simpan Perubahan</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center space-y-6 text-center animate-fadeIn">
                                <div className="p-6 bg-gray-50 rounded-full">
                                    <Info className="h-10 w-10 text-gray-300" />
                                </div>
                                <div className="max-w-md">
                                    <h4 className="text-xl font-black text-gray-800">Sistem Outlet Terverifikasi</h4>
                                    <p className="text-sm font-medium text-gray-400 mt-2 leading-relaxed">
                                        Informasi di samping akan dicetak pada nota thermal setiap transaksi. Pastikan alamat dan nomor telepon sudah benar untuk keperluan klaim pelanggan.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
