'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_INFO } from '@/lib/constants'
import { Sparkles, Clock } from 'lucide-react'

export default function Hero() {
    const scrollToMenu = () => {
        const element = document.getElementById('menu-lengkap')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleWhatsAppClick = () => {
        window.open(CONTACT_INFO.whatsapp, '_blank')
    }

    return (
        <section id="hero" className="relative bg-linear-to-br from-[#2D2D2D] via-[#1A1A1A] to-[#000000] text-white overflow-hidden min-h-[90vh] flex items-center">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-kopi-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-kopi-highlight/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-kopi-cream/5 rounded-full blur-2xl"></div>

            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left animate-fadeInUp">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-kopi-accent" />
                            <span className="text-sm font-medium">Premium Quality Beverages</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-4 lg:mb-6 leading-tight">
                            Example <span className="text-kopi-highlight">Coffe</span>
                            <br />
                            <span className="text-kopi-cream">Your Daily Escape</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 text-white/90 max-w-xl mx-auto lg:mx-0">
                            Nikmati kopi premium, es teh segar, dan minuman non-coffee pilihan terbaik
                        </p>

                        <p className="text-sm sm:text-base mb-8 lg:mb-10 text-white/80 max-w-xl mx-auto lg:mx-0">
                            Setiap tegukan adalah perjalanan rasa yang sempurna. Dibuat dengan passion, disajikan dengan cinta untuk menemani hari-hari Anda.
                        </p>

                        {/* Buttons - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-0">
                            <button
                                onClick={scrollToMenu}
                                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                            >
                                Lihat Menu
                            </button>
                            <button
                                onClick={handleWhatsAppClick}
                                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Image & Hours */}
                    <div className="relative animate-slideInRight">
                        <div className="relative rounded-3xl overflow-hidden shadow-premium-lg">
                            <Image
                                src="/images/toko.svg"
                                alt="Example Coffe Shop"
                                width={600}
                                height={400}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>

                        {/* Hours Card - Mobile Optimized */}
                        <div className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto bg-white text-kopi-dark p-4 sm:p-5 rounded-2xl shadow-premium animate-float">
                            <div className="flex items-center space-x-3">
                                <div className="bg-kopi-accent/20 p-2 rounded-full">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-kopi-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base text-kopi-primary">Buka Setiap Hari</p>
                                    <p className="text-xs sm:text-sm text-gray-600">10:00 - 21:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
                </svg>
            </div>
        </section>
    )
}
