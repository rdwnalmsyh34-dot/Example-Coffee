import Image from 'next/image'

export default function MenuImageSection() {
    return (
        <section className="py-20 bg-kopi-cream/30" id="menu-lengkap">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-fadeInUp">
                    <span className="text-kopi-secondary font-semibold text-sm tracking-wider uppercase mb-2 block">
                        Pilihan Lengkap
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-kopi-primary mb-6">
                        Daftar Menu Kami
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Temukan minuman favoritmu dari berbagai pilihan Coffee, Non-Coffee, Tea Series, hingga Yakult Series dengan varian topping yang lezat.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white p-4 md:p-8 rounded-3xl shadow-premium animate-slideUp">
                    <div className="relative w-full h-auto min-h-[600px] md:min-h-[800px] rounded-2xl overflow-hidden">
                        <Image
                            src="/images/menu.png"
                            alt="Daftar Menu Kopi Roca Lengkap"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 italic">
                            *Harga dan ketersediaan menu dapat berubah sewaktu-waktu
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
