'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { MenuItem } from '@/lib/menuData'
import { useEffect } from 'react'

interface MenuModalProps {
    item: MenuItem | null
    onClose: () => void
}

export default function MenuModal({ item, onClose }: MenuModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (item) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [item])

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!item) return null

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
                className="relative bg-white rounded-3xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6 text-kopi-primary" />
                </button>

                {/* Image */}
                <div className="relative w-full h-80 sm:h-96 bg-linear-to-br from-kopi-cream/30 to-kopi-accent/20 rounded-t-3xl">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                    />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-kopi-primary">
                            {item.name}
                        </h2>
                        {!item.variants && (
                            <div className="bg-linear-to-r from-kopi-primary to-kopi-secondary text-white px-4 py-2 rounded-full shadow-lg shrink-0">
                                <p className="text-lg font-bold">{formatPrice(item.price!)}</p>
                            </div>
                        )}
                    </div>

                    {/* Category & Subcategory Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-xs font-semibold text-kopi-secondary bg-kopi-cream px-3 py-1 rounded-full uppercase tracking-wide">
                            {item.category === 'non-coffee' ? 'Non-Coffee' : item.category}
                        </span>
                        {item.subcategory && (
                            <span className="text-xs font-semibold text-white bg-kopi-accent px-3 py-1 rounded-full uppercase tracking-wide">
                                {item.subcategory}
                            </span>
                        )}
                    </div>

                    {/* Size Variants */}
                    {item.variants && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-kopi-secondary uppercase tracking-wide mb-3">
                                Pilihan Ukuran
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {item.variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="bg-linear-to-br from-kopi-cream/50 to-kopi-accent/20 border-2 border-kopi-accent/30 rounded-xl p-4 text-center hover:border-kopi-accent transition-colors"
                                    >
                                        <div className="text-kopi-primary font-bold text-lg mb-1">
                                            {variant.size}
                                        </div>
                                        <div className="text-kopi-secondary font-bold text-base">
                                            {formatPrice(variant.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-kopi-secondary uppercase tracking-wide mb-2">
                            Deskripsi
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {item.description}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-kopi-secondary uppercase tracking-wide mb-2">
                            Manfaat
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {item.benefits}
                        </p>
                    </div>

                    {/* CTA Button */}
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => window.open('https://wa.me/62895341004935', '_blank')}
                            className="flex-1 btn-primary text-lg py-4 flex items-center justify-center gap-2"
                        >
                            <span>WhatsApp</span>
                        </button>
                        <button
                            onClick={() => window.open('https://shopee.co.id/universal-link/now-food/shop/22422947?deep_and_deferred=1&shareChannel=copy_link', '_blank')}
                            className="flex-1 bg-[#EE4D2D] text-white font-bold rounded-2xl text-lg py-4 hover:bg-[#ff5d3d] transition-all hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>ShopeeFood</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
