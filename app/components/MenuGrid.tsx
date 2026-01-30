'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { MenuItem, menuItems as staticMenuItems } from '@/lib/menuData'
import MenuModal from './MenuModal'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type Category = 'all' | 'coffee' | 'non-coffee' | 'tea' | 'fruity'

function MenuItemImage({ item }: { item: MenuItem }) {
    const [imgSrc, setImgSrc] = useState(item.image || '/images/toko.svg')
    const [isFallback, setIsFallback] = useState(false)

    return (
        <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            unoptimized={!isFallback}
            onError={() => {
                setImgSrc('/images/toko.svg')
                setIsFallback(true)
            }}
        />
    )
}

export default function MenuGrid() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState<Category>('all')
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch from Firestore 'produk' collection (SSOT)
    useEffect(() => {
        // If not logged in, use static data as fallback (Firestore rules require auth)
        if (!user) {
            setMenuItems(staticMenuItems.filter(item => item.isActive));
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'produk'), where('isActive', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data()
                // Force SVG extension and match actual filenames
                let imagePath = data.image || (data.imageName ? `/images/${data.imageName}.svg` : '/images/toko.svg')

                // Convert common raster extensions to .svg
                if (imagePath.match(/\.(png|jpg|jpeg)$/i)) {
                    imagePath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.svg')
                }

                // Specific fix for Kopi Susu (filesystem is lowercase kebab-case)
                if (imagePath.toLowerCase().includes('kopi susu.svg')) {
                    imagePath = '/images/kopi-susu.svg'
                }

                // Strict Overrides for Rebranding requirements
                if (data.name === 'Bottle Coffee') {
                    imagePath = '/images/Bottle Coffeee.svg'
                } else if (data.name === 'Es Kopi Hitam Americano') {
                    imagePath = '/images/Kopi Hitam.svg'
                } else if (data.name === 'Matcha Cheese') {
                    imagePath = '/images/Matcha Cheese.svg'
                }

                return {
                    id: doc.id,
                    ...data,
                    image: imagePath
                }
            }) as MenuItem[];
            setMenuItems(items);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            // On permission error or other errors, fallback to static data
            setMenuItems(staticMenuItems.filter(item => item.isActive));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const category = searchParams.get('category') as Category
        if (category && (['all', 'coffee', 'non-coffee', 'tea', 'fruity'].includes(category))) {
            setSelectedCategory(category)

            // Auto scroll to menu section
            const element = document.getElementById('menu-lengkap')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [searchParams])

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory)

    const categories: { key: Category; label: string }[] = [
        { key: 'all', label: 'Semua Menu' },
        { key: 'coffee', label: 'Coffee' },
        { key: 'non-coffee', label: 'Non-Coffee' },
        { key: 'tea', label: 'Tea' },
        { key: 'fruity', label: 'Fruity' },
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)
    }

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-kopi-primary mb-4" />
                <p className="text-gray-400 font-medium">Memuat Menu...</p>
            </div>
        )
    }

    return (
        <>
            <section className="py-20 bg-[#F5F5F5]" id="menu-lengkap">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-kopi-secondary font-semibold text-sm tracking-wider uppercase mb-2 block">
                            Menu Lengkap
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-display text-kopi-primary mb-6">
                            Daftar Menu Kami
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Klik menu untuk melihat detail lengkap, harga, dan manfaatnya
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${selectedCategory === cat.key
                                    ? 'bg-linear-to-r from-kopi-primary to-kopi-secondary text-white shadow-lg scale-105'
                                    : 'bg-kopi-cream text-kopi-dark hover:bg-kopi-accent hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-premium transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-square bg-white border-2 border-kopi-primary/20">
                                        <MenuItemImage item={item} />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-bold text-sm sm:text-base text-kopi-primary mb-1 line-clamp-2 group-hover:text-kopi-secondary transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-kopi-secondary font-bold text-sm sm:text-base">
                                                {item.variants
                                                    ? `Mulai dari ${formatPrice(Math.min(...item.variants.map(v => v.price)))}`
                                                    : formatPrice(item.price!)}
                                            </p>
                                            <span className="text-xs text-kopi-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                Lihat Detail →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-400 italic">
                                Belum ada menu yang aktif. Silakan lakukan Bulk Import dari Admin Dashboard.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <MenuModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </>
    )
}
