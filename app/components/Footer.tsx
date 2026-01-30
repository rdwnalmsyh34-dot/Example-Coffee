'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Coffee, Phone, MapPin, Mail, Instagram, Facebook, Twitter, X, MessageCircle, ShoppingBag } from 'lucide-react'
import { CONTACT_INFO } from '@/lib/constants'

export default function Footer() {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

    const footerLinks = {
        'Menu': [
            { name: 'Home', href: '/' },
            { name: 'Menu', href: '#menu-lengkap' },
            { name: 'Order Online', href: '#order', isOrder: true },
        ],
        'Produk': [
            { name: 'Kopi Signature', href: '/?category=coffee#menu-lengkap' },
            { name: 'Es Teh Segar', href: '/?category=tea#menu-lengkap' },
            { name: 'Non-Coffee Drinks', href: '/?category=non-coffee#menu-lengkap' },
            { name: 'Fruity Drinks Series', href: '/?category=fruity#menu-lengkap' },
        ],
    }

    const handleLinkClick = (e: React.MouseEvent, link: { name: string, href: string, isOrder?: boolean }) => {
        if (link.isOrder) {
            e.preventDefault()
            setIsOrderModalOpen(true)
        } else if (link.href.startsWith('#')) {
            e.preventDefault()
            const element = document.getElementById(link.href.substring(1))
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <footer id="footer" className="bg-linear-to-br from-black via-kopi-primary to-kopi-secondary text-white relative">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-24">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
                                <Coffee className="h-8 w-8 text-kopi-cream" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold font-display text-kopi-cream leading-tight">Example Coffe</h3>
                                <p className="text-kopi-cream/80 text-sm">Kopi, Es Teh & Non-Coffee</p>
                            </div>
                        </div>
                        <p className="text-kopi-cream/90 mb-8 leading-relaxed max-w-[550px]">
                            Nikmati kopi premium, es teh segar, dan minuman non-coffee pilihan terbaik.
                            Setiap tegukan adalah perjalanan rasa yang sempurna.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="text-center lg:text-left">
                            <h4 className="text-lg font-bold font-display text-kopi-cream mb-6">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={(e) => handleLinkClick(e, link)}
                                            className="text-kopi-cream/70 hover:text-kopi-cream transition-all text-sm cursor-pointer hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Info - Realigned to match upper columns */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-10 border-t border-white/10">
                    <div className="lg:col-span-2 flex flex-col items-center lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 text-center lg:text-left lg:pl-24">
                        <div className="bg-white/10 p-2.5 rounded-full shadow-inner">
                            <MapPin className="h-5 w-5 text-kopi-accent" />
                        </div>
                        <div>
                            <p className="text-kopi-cream text-sm font-semibold mb-0.5">Lokasi</p>
                            <p className="text-kopi-cream/80 text-sm max-w-[420px]">{CONTACT_INFO.address}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col items-center lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 text-center lg:text-left">
                        <div className="bg-white/10 p-2.5 rounded-full shadow-inner">
                            <Phone className="h-5 w-5 text-kopi-accent" />
                        </div>
                        <div>
                            <p className="text-kopi-cream text-sm font-semibold mb-0.5">Hubungi Kami</p>
                            <p className="text-kopi-cream/80 text-sm">{CONTACT_INFO.phoneFormatted}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col items-center lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 text-center lg:text-left">
                        <div className="bg-white/10 p-2.5 rounded-full shadow-inner">
                            <Mail className="h-5 w-5 text-kopi-accent" />
                        </div>
                        <div>
                            <p className="text-kopi-cream text-sm font-semibold mb-0.5">Email</p>
                            <p className="text-kopi-cream/80 text-sm">rayarzkyn23@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-10 text-center">
                    <p className="text-kopi-cream/70 text-sm mb-3">
                        &copy; {new Date().getFullYear()} Example Coffe. All rights reserved.
                    </p>
                    <p className="text-kopi-cream/50 text-xs italic tracking-wide">
                        Handcrafted with passion by <span className="text-kopi-cream/80 font-semibold not-italic">Raya Rizkyana</span>
                    </p>
                </div>
            </div>

            {/* Order Selection Modal */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-slideUp text-kopi-dark">
                        <button
                            onClick={() => setIsOrderModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h3 className="text-2xl font-bold font-display text-kopi-primary mb-2 text-center">Order Online</h3>
                        <p className="text-gray-600 mb-8 text-center">Pilih cara pemesanan favorit Anda</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.open(CONTACT_INFO.whatsapp, '_blank')}
                                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-3"
                            >
                                <MessageCircle className="h-6 w-6" />
                                <span>WhatsApp</span>
                            </button>

                            <button
                                onClick={() => window.open(CONTACT_INFO.shopeeFood, '_blank')}
                                className="w-full bg-[#EE4D2D] hover:bg-[#ff5d3d] text-white font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-3"
                            >
                                <ShoppingBag className="h-6 w-6" />
                                <span>ShopeeFood</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    )
}
