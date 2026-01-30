'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ShoppingBag, Store, MapPin, Instagram, Facebook } from 'lucide-react'
import { CONTACT_INFO } from '@/lib/constants'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setIsMenuOpen(false)
        }
    }

    const navItems = [
        { name: 'Home', id: 'hero' },
        { name: 'Kategori', id: 'kategori' },
        { name: 'Menu Lengkap', id: 'menu-lengkap' },
        { name: 'Kontak', id: 'footer' },
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex justify-between items-center">
                    {/* Logo - SVG-based logo with Brand Text */}
                    <Link href="/" className="flex flex-col items-center sm:items-start group">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                <Image
                                    src="/images/Logo Baru.svg"
                                    alt="Example Coffe Icon"
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold font-display text-kopi-primary tracking-tight leading-none">
                                Example <span className="text-kopi-accent">Coffe</span>
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-kopi-accent font-display italic tracking-[0.12em] leading-none mt-1.5 uppercase">
                            coffee makes everything happy
                        </p>
                    </Link>

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.id)}
                                className="text-gray-700 hover:text-kopi-primary font-medium transition-all duration-300 relative group text-sm"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-kopi-primary to-kopi-accent group-hover:w-full transition-all duration-300"></span>
                            </button>
                        ))}
                        <button
                            onClick={() => window.open(CONTACT_INFO.whatsapp, '_blank')}
                            className="bg-linear-to-r from-kopi-primary to-kopi-secondary text-white px-5 py-2 rounded-full font-semibold hover:shadow-premium transition-all duration-300 hover:scale-105 text-sm"
                        >
                            Hubungi Kami
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden relative p-2 hover:bg-kopi-cream rounded-lg transition-all duration-300 group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-kopi-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-kopi-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-kopi-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t pt-4 animate-fadeIn">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-left text-gray-700 hover:text-kopi-primary hover:bg-kopi-cream font-medium py-2.5 px-4 rounded-lg transition-all"
                                >
                                    {item.name}
                                </button>
                            ))}
                            <button
                                aria-label="Contact on WhatsApp"
                                onClick={() => window.open(CONTACT_INFO.whatsapp, '_blank')}
                                className="bg-linear-to-r from-kopi-primary to-kopi-secondary text-white px-6 py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all mt-2"
                            >
                                Hubungi Kami
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-kopi-accent shrink-0" />
                                <span>{CONTACT_INFO.phoneFormatted}</span>
                            </div>
                            <div className="flex items-start space-x-2 text-xs text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-kopi-accent shrink-0 mt-0.5" />
                                <span>Cicalengka, Bandung</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Info - Desktop Only */}
                <div className="hidden lg:flex justify-end items-center space-x-6 mt-3 text-sm">
                    <button
                        className="flex items-center space-x-2 text-kopi-secondary hover:text-kopi-primary transition-colors text-sm font-medium"
                        onClick={() => window.open(CONTACT_INFO.whatsapp, '_blank')}
                    >
                        <Phone className="h-4 w-4" />
                        <span>{CONTACT_INFO.phoneFormatted}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-600 hover:text-kopi-primary transition-colors">
                        <MapPin className="h-4 w-4" />
                        <span>Cicalengka, Bandung</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
