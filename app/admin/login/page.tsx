'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-premium">
                <div className="text-center">
                    <div className="relative w-32 h-20 mx-auto mb-6">
                        <Image
                            src="/images/Logo Baru.svg"
                            alt="Example Coffe Logo"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-kopi-primary font-display">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-12 py-3 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kopi-primary focus:border-transparent transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-12 py-3 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kopi-primary focus:border-transparent transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-kopi-primary to-kopi-secondary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kopi-primary transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
