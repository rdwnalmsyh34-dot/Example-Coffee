'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import {
    CalendarDays,
    Search,
    Loader2,
    Clock,
    User,
    ArrowRightLeft
} from 'lucide-react';

interface Attendance {
    id: string;
    employeeName: string;
    type: 'Masuk' | 'Keluar';
    timestamp: any;
    note?: string;
}

export default function AttendancePage() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'absensi'), orderBy('timestamp', 'desc'), limit(100));
        const unsub = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Attendance[]);
            setLoading(false);
        }, (error) => {
            console.error("Attendance Error:", error);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const filteredLogs = logs.filter(l =>
        l.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h3 className="text-2xl font-black text-gray-800 font-display italic">Log Absensi Pegawai</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Monitoring Kehadiran & Kedisiplinan</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari nama pegawai..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-kopi-primary outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider italic">Aktivitas Absensi Terbaru</h4>
                    <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Masuk</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span>Keluar</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-50">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
                                <div className="flex items-center space-x-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-xs text-gray-400 border border-gray-100 shadow-sm group-hover:bg-kopi-primary group-hover:text-white transition-all">
                                        {log.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-lg uppercase tracking-tight">{log.employeeName}</p>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${log.type === 'Masuk' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {log.type}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold italic tracking-tighter">
                                                {log.timestamp?.toDate().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end space-x-2 text-gray-800">
                                            <Clock className="h-4 w-4 text-kopi-primary" />
                                            <span className="text-xl font-black">{log.timestamp?.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-1">Waktu Server</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100 hidden sm:block" />
                                    <button className="p-3 bg-gray-50 text-gray-300 rounded-xl hover:bg-kopi-cream hover:text-kopi-primary transition-all">
                                        <ArrowRightLeft className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4 opacity-30 italic font-bold">
                            <User className="h-12 w-12 mx-auto text-gray-300" />
                            <p className="text-gray-400">Belum ada catatan absensi terdeteksi.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
