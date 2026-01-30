'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { MenuItem } from '@/lib/menuData'
import { useState, useEffect } from 'react'
import { CONTACT_INFO } from '@/lib/constants'

interface MenuModalProps {
    item: MenuItem | null
    onClose: () => void
}

function ModalImage({ item }: { item: MenuItem }) {
    const [imgSrc, setImgSrc] = useState(item.image || '/images/toko.svg')
    const [isFallback, setIsFallback] = useState(false)

    // Reset image when item changes
    useEffect(() => {
        let imagePath = item.image || '/images/toko.svg'

        // Force SVG extension
        if (imagePath.match(/\.(png|jpg|jpeg)$/i)) {
            imagePath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.svg')
        }

        // Specific fix for Kopi Susu
        if (imagePath.toLowerCase().includes('kopi susu.svg')) {
            imagePath = '/images/kopi-susu.svg'
        }

        // Strict Overrides for Rebranding requirements
        if (item.name === 'Bottle Coffee') {
            imagePath = '/images/Bottle Coffeee.svg'
        } else if (item.name === 'Es Kopi Hitam Americano') {
            imagePath = '/images/Kopi Hitam.svg'
        } else if (item.name === 'Matcha Cheese') {
            imagePath = '/images/Matcha Cheese.svg'
        }

        setImgSrc(imagePath)
        setIsFallback(false)
    }, [item.id, item.image])

    return (
        <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-contain p-4"
            unoptimized={!isFallback}
            onError={() => {
                setImgSrc('/images/toko.svg')
                setIsFallback(true)
            }}
        />
    )
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
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-y-auto"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Modal Container */}
            <div
                className="relative bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-premium-lg max-w-lg w-full mt-auto sm:my-8 overflow-hidden animate-slideUp max-h-[90vh] sm:max-h-none flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Moved inside the container for better mobile positioning */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6 text-kopi-primary" />
                </button>

                {/* Image Section - Fixed height on mobile, flexible on desktop */}
                <div className="relative w-full h-72 sm:h-96 bg-linear-to-br from-[#E5E5E5] to-[#CCCCCC] shrink-0">
                    <ModalImage item={item} />
                </div>

                {/* Content - Scrollable on small screens if needed */}
                <div className="p-6 sm:p-8 overflow-y-auto">
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
                                        className="bg-linear-to-br from-[#E5E5E5] to-[#CCCCCC] border-2 border-[#CCCCCC] rounded-xl p-4 text-center hover:border-kopi-accent transition-colors"
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
                            onClick={() => window.open(CONTACT_INFO.whatsapp, '_blank')}
                            className="flex-1 btn-primary text-lg py-4 flex items-center justify-center gap-2"
                        >
                            <span>WhatsApp</span>
                        </button>
                        <button
                            onClick={() => window.open(CONTACT_INFO.shopeeFood, '_blank')}
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
