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
    UserCheck,
    Search,
    Loader2,
    Briefcase,
    TrendingUp,
    ShoppingBag,
    Award
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    role: string;
}

interface Transaction {
    id: string;
    employeeId?: string;
    employeeName?: string;
    total: number;
}

export default function EmployeeTasksPage() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const unsubEmployees = onSnapshot(collection(db, 'pegawai'), (snapshot) => {
            setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[]);
        }, (error) => {
            console.error("Tasks Employees Error:", error);
        });

        const unsubTransactions = onSnapshot(query(collection(db, 'penjualan'), orderBy('timestamp', 'desc'), limit(500)), (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[]);
            setLoading(false);
        }, (error) => {
            console.error("Tasks Transactions Error:", error);
            setLoading(false);
        });

        return () => {
            unsubEmployees();
            unsubTransactions();
        };
    }, [user]);

    const getEmployeeStats = () => {
        return employees.map(emp => {
            const empSales = transactions.filter(t => t.employeeName === emp.name || (t as any).cashier === emp.name);
            const totalRevenue = empSales.reduce((acc, t) => acc + (t.total || 0), 0);
            return {
                ...emp,
                transactionCount: empSales.length,
                totalRevenue
            };
        }).sort((a, b) => b.transactionCount - a.transactionCount);
    };

    const stats = getEmployeeStats();

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-kopi-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                    <Briefcase className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-800 font-display italic">Penugasan & Performa</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Analisis Produktivitas Pegawai</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.map((emp, i) => (
                    <div key={emp.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative group overflow-hidden">
                        {i === 0 && (
                            <div className="absolute top-0 right-0 p-6">
                                <Award className="h-8 w-8 text-orange-400 animate-pulse" />
                            </div>
                        )}

                        <div className="flex items-center space-x-6 mb-8">
                            <div className="w-16 h-16 bg-kopi-cream rounded-[1.5rem] flex items-center justify-center font-black text-2xl text-kopi-primary shadow-inner">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-800">{emp.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{emp.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                                    <ShoppingBag className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Transaksi</span>
                                </div>
                                <p className="text-2xl font-black text-gray-800">{emp.transactionCount}</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                                    <TrendingUp className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Revenue</span>
                                </div>
                                <p className="text-lg font-black text-emerald-600 truncate">Rp {(emp.totalRevenue / 1000).toFixed(0)}k</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                            <span>Efisiensi Kerja</span>
                            <span className="text-gray-800 font-black">94%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                    <h4 className="text-xl font-black text-gray-800 font-display italic">Penugasan Berdasarkan Shift</h4>
                    <p className="text-sm text-gray-500 mt-2">Data di atas disinkronisasi secara otomatis dari log transaksi kasir. Anda dapat memantau kontribusi revenue setiap pegawai untuk program insentif bulanan.</p>
                </div>
                <button className="px-10 py-5 bg-kopi-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-kopi-primary/20 hover:scale-105 transition-all">
                    Atur Penugasan Baru
                </button>
            </div>
        </div>
    );
}
