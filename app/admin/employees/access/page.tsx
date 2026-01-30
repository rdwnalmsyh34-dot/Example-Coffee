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
    Users,
    Plus,
    ShieldCheck,
    UserCheck,
    Loader2,
    X,
    Trash2,
    Lock,
    Smartphone
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    role: 'Admin' | 'Kasir' | 'Owner';
    phoneNumber: string;
    isActive: boolean;
}

export default function EmployeeAccessPage() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: 'Kasir' as 'Admin' | 'Kasir' | 'Owner',
        phoneNumber: '',
        isActive: true
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsub = onSnapshot(collection(db, 'pegawai'), (snapshot) => {
            setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[]);
            setLoading(false);
        }, (error) => {
            console.error("Employee Access Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'pegawai'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
            setFormData({ name: '', role: 'Kasir', phoneNumber: '', isActive: true });
        } catch (error) {
            console.error("Error saving employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteEmployee = async (id: string) => {
        if (confirm("Hapus akses pegawai ini?")) {
            await deleteDoc(doc(db, 'pegawai', id));
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await updateDoc(doc(db, 'pegawai', id), { isActive: !current });
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
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Akses & Otorisasi Pegawai</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Manajemen Peran Keamanan</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-kopi-primary/20 flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Pegawai</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {employees.map((emp) => (
                    <div key={emp.id} className={`bg-white rounded-3xl p-6 border transition-all ${emp.isActive ? 'border-gray-100 shadow-sm' : 'border-red-50 bg-gray-50/50 grayscale'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${emp.isActive ? 'bg-kopi-cream text-kopi-primary' : 'bg-gray-100 text-gray-300'}`}>
                                {emp.name.charAt(0)}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${emp.role === 'Owner' ? 'bg-purple-100 text-purple-600' :
                                    emp.role === 'Admin' ? 'bg-blue-100 text-blue-600' :
                                        'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    {emp.role}
                                </span>
                                {!emp.isActive && <span className="text-[8px] font-bold text-red-500 mt-2 italic">Akses Diblokir</span>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-black text-gray-800">{emp.name}</h4>
                                <div className="flex items-center space-x-2 text-gray-400 mt-1">
                                    <Smartphone className="h-3 w-3" />
                                    <p className="text-[10px] font-bold">{emp.phoneNumber}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleStatus(emp.id, emp.isActive)}
                                        className={`p-3 rounded-xl transition-all ${emp.isActive ? 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-500' : 'bg-emerald-500 text-white shadow-lg'}`}
                                        title={emp.isActive ? 'Blokir Akses' : 'Aktifkan Kembali'}
                                    >
                                        {emp.isActive ? <Lock className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => deleteEmployee(emp.id)}
                                    className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
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
                                <h3 className="text-xl font-black italic">Daftarkan Pegawai</h3>
                                <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                        placeholder="0812..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Peran / Otoritas</label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm"
                                    >
                                        <option value="Kasir">Kasir</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Owner">Owner</option>
                                    </select>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-kopi-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                    <span>Daftarkan Sekarang</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
