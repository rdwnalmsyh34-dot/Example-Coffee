'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu as MenuIcon, X, Phone, MapPin } from 'lucide-react'

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
                    {/* Logo - Integrated Graphic Icon and Brand Name */}
                    <Link href="/" className="flex flex-col items-center sm:items-start group">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                                <Image
                                    src="/images/Logo Kopi Roca.png"
                                    alt="Kopi Roca Icon"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="relative w-[100px] h-[25px] sm:w-[130px] sm:h-[35px]">
                                <Image
                                    src="/images/Teks Logo.png"
                                    alt="Kopi Roca Text"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-kopi-primary/90 font-display italic tracking-[0.15em] leading-none mt-1 uppercase">
                            every moment feels lighter
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
                            onClick={() => window.open('https://wa.me/62895341004935', '_blank')}
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
                                onClick={() => window.open('https://wa.me/62895341004935', '_blank')}
                                className="bg-linear-to-r from-kopi-primary to-kopi-secondary text-white px-6 py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all mt-2"
                            >
                                Hubungi Kami
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-kopi-accent shrink-0" />
                                <span>0895-3410-04935</span>
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
                    <div className="flex items-center space-x-2 text-gray-600 hover:text-kopi-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>0895-3410-04935</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 hover:text-kopi-primary transition-colors">
                        <MapPin className="h-4 w-4" />
                        <span>Cicalengka, Bandung</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
