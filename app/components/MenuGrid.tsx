'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { menuItems, MenuItem } from '@/lib/menuData'
import MenuModal from './MenuModal'

type Category = 'all' | 'coffee' | 'non-coffee' | 'tea' | 'fruity'

export default function MenuGrid() {
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState<Category>('all')
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

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

    return (
        <>
            <section className="py-20 bg-white" id="menu-lengkap">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-premium transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative w-full aspect-square bg-white border-2 border-kopi-primary/40">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                    />
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
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Tidak ada menu di kategori ini</p>
                        </div>
                    )}
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
