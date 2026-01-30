'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    limit,
    where,
    Timestamp,
    doc,
    writeBatch
} from 'firebase/firestore';
import {
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    ChevronRight,
    TrendingUp,
    Loader2,
    CheckCircle2,
    X,
    Printer,
    Smartphone,
    CreditCard,
    Banknote
} from 'lucide-react';
import { printer, ReceiptData } from '@/lib/printer';

interface Product {
    id: string;
    name: string;
    price?: number;
    variants?: { size: string; price: number }[];
    category: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface TransactionRecord {
    id: string;
    item: string;
    quantity: number;
    total: number;
    createdAt: Timestamp;
}

export default function SalesPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<ReceiptData | null>(null);
    const [printError, setPrintError] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer'>('Tunai');
    const [isPrinterCompatible, setIsPrinterCompatible] = useState(true);
    const [employees, setEmployees] = useState<{ id: string, name: string }[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setIsPrinterCompatible('bluetooth' in navigator);

        const unsubProducts = onSnapshot(collection(db, 'produk'), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
            setLoading(false);
        }, (error) => {
            console.error("Sales Products Error:", error);
            setLoading(false);
        });

        const qTransactions = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(100));
        const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TransactionRecord[]);
        }, (error) => {
            console.error("Sales Transactions Error:", error);
        });

        const unsubEmployees = onSnapshot(collection(db, 'pegawai'), (snapshot) => {
            setEmployees(snapshot.docs.filter(d => d.data().isActive).map(doc => ({ id: doc.id, name: doc.data().name })));
        }, (error) => {
            console.error("Sales Employees Error:", error);
        });

        return () => {
            unsubProducts();
            unsubTransactions();
            unsubEmployees();
        };
    }, [user]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 3)
            .toUpperCase();
    };

    const addToCart = (product: Product) => {
        const price = product.price || (product.variants ? product.variants[0].price : 0);
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { id: product.id, name: product.name, price, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        setPrintError(false);

        const transactionId = `TRX-${Date.now()}`;
        const timestamp = new Date();

        const receiptData: ReceiptData = {
            transactionId,
            timestamp,
            items: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            })),
            subtotal: totalAmount,
            total: totalAmount,
            paymentMethod,
            employeeName: selectedEmployee || 'Kasir Default'
        };

        try {
            await addDoc(collection(db, 'penjualan'), {
                ...receiptData,
                timestamp: serverTimestamp(),
            });

            const batch = writeBatch(db);
            for (const item of cart) {
                const transRef = doc(collection(db, 'transactions'));
                batch.set(transRef, {
                    item: item.name,
                    productId: item.id,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    type: "sale",
                    employeeName: selectedEmployee || 'Kasir Default',
                    createdAt: serverTimestamp()
                });
            }
            await batch.commit();

            setLastTransaction(receiptData);
            setCart([]);
            setShowSuccess(true);

            if (isPrinterCompatible) {
                const success = await printer.print(receiptData);
                if (!success) setPrintError(true);
            }

            setTimeout(() => {
                if (!printError) setShowSuccess(false);
            }, 5000);

        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Gagal menyimpan transaksi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReprint = async () => {
        if (lastTransaction) {
            const success = await printer.print(lastTransaction);
            if (success) setPrintError(false);
            else alert("Masih gagal mencetak nota.");
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
        <div className="h-full flex flex-col space-y-8 animate-fadeIn relative">
            {/* Notifications */}
            {showSuccess && (
                <div className="fixed top-24 right-10 z-50 flex flex-col items-end space-y-4">
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-3 animate-bounce">
                        <CheckCircle2 className="h-6 w-6" />
                        <span className="font-black">Transaksi Berhasil!</span>
                    </div>
                    {printError ? (
                        <div className="bg-orange-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex flex-col space-y-2 animate-fadeIn transition-all">
                            <div className="flex items-center space-x-3">
                                <X className="h-6 w-6" />
                                <span className="font-black text-sm">Gagal Mencetak Nota</span>
                            </div>
                            <button
                                onClick={handleReprint}
                                className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                            >
                                <Printer className="h-4 w-4" />
                                <span>Cetak Ulang Nota</span>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-blue-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-3 animate-fadeIn">
                            <Printer className="h-6 w-6" />
                            <span className="font-black text-sm">Nota Tercetak</span>
                        </div>
                    )}
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="p-3 bg-white text-gray-400 rounded-full shadow-lg hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {!isPrinterCompatible && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 border border-red-100">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-sm font-bold">Browser tidak mendukung Web Bluetooth. Fitur cetak nota dinonaktifkan.</span>
                </div>
            )}

            {/* Product Selection */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-gray-800 font-display italic">Pilih Produk</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} Produk Tersedia</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="group transition-all duration-300"
                        >
                            <div className="bg-white aspect-square rounded-2xl md:rounded-[1.5rem] p-3 md:p-4 shadow-sm border-2 border-kopi-primary hover:bg-kopi-cream/10 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden">
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="text-xl md:text-2xl font-black text-kopi-primary">
                                        {getInitials(product.name)}
                                    </span>
                                </div>
                                <div className="w-full mt-1">
                                    <h4 className="font-bold text-gray-800 text-[8px] md:text-[9px] uppercase tracking-wider line-clamp-2 leading-tight">
                                        {product.name}
                                    </h4>
                                    <p className="text-kopi-secondary font-black text-[8px] md:text-[9px] mt-0.5">
                                        Rp {(product.price || (product.variants?.[0].price || 0)).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart Listing */}
            <div className="flex-1">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-kopi-cream rounded-2xl text-kopi-primary">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 font-display italic">Daftar Belanja</h3>
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={() => setCart([])}
                                className="text-red-400 hover:text-red-600 transition-colors flex items-center space-x-1 font-bold text-sm"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Bersihkan</span>
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 min-h-[300px]">
                        {cart.length > 0 ? (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-kopi-primary shadow-sm border border-gray-100 uppercase">
                                            {getInitials(item.name).slice(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-800 text-lg leading-tight">{item.name}</h4>
                                            <p className="text-xs font-bold text-gray-400 mt-1">Rp {item.price.toLocaleString('id-ID')} / item</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors">
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-10 text-center font-black text-gray-800">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-xl transition-colors">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-right w-40">
                                            <p className="font-black text-kopi-secondary text-2xl">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-300 font-display italic">Keranjang Kosong</p>
                                    <p className="text-sm font-bold text-gray-300 mt-2 uppercase tracking-widest">Pilih produk di atas untuk memulai</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Method & Checkout */}
                    <div className="mt-10 pt-10 border-t-2 border-dashed border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                            <div>
                                <div className="mb-8">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Pilih Kasir Bertugas</p>
                                    <select
                                        value={selectedEmployee}
                                        onChange={e => setSelectedEmployee(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black text-xs text-kopi-primary focus:ring-2 focus:ring-kopi-primary transition-all"
                                    >
                                        <option value="">-- PILIH KASIR --</option>
                                        {employees.map(e => <option key={e.id} value={e.name}>{e.name.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Metode Pembayaran</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'Tunai', icon: Banknote },
                                        { id: 'QRIS', icon: CreditCard },
                                        { id: 'Transfer', icon: Smartphone }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id
                                                ? 'border-kopi-primary bg-kopi-cream text-kopi-primary shadow-lg'
                                                : 'border-gray-50 text-gray-400 opacity-60 hover:opacity-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <method.icon className="h-6 w-6 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{method.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-right mb-6 space-y-1">
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                                        <h2 className="text-4xl md:text-5xl font-black text-gray-800 font-display leading-none tracking-tighter">
                                            Rp {totalAmount.toLocaleString('id-ID')}
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    disabled={cart.length === 0 || isSubmitting}
                                    onClick={handleCheckout}
                                    className="w-full md:w-auto px-8 py-5 bg-kopi-primary text-white font-black rounded-2xl shadow-lg shadow-kopi-primary/20 hover:shadow-kopi-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4 disabled:opacity-30 disabled:grayscale disabled:scale-100"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-lg italic">Bayar & Cetak</span>
                                            <Printer className="h-6 w-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popularity Floor */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-2.5 bg-orange-100 rounded-xl text-orange-500">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 font-display italic">Popularitas Penjualan (Live)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(() => {
                        const menuCount: Record<string, number> = {};
                        transactions.forEach(t => {
                            menuCount[t.item] = (menuCount[t.item] || 0) + t.quantity;
                        });
                        const sorted = Object.entries(menuCount)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 8);

                        if (sorted.length === 0) return <p className="col-span-full text-center text-gray-300 py-10 font-bold italic">Belum ada data penjualan.</p>;

                        return sorted.map(([name, count], i) => (
                            <div key={name} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] group hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 flex items-center justify-center font-black text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-kopi-primary group-hover:text-white transition-colors uppercase">
                                        {i + 1}
                                    </div>
                                    <span className="font-bold text-gray-700 text-sm leading-tight line-clamp-2">{name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-lg leading-none">{count}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Terjual</p>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
}
