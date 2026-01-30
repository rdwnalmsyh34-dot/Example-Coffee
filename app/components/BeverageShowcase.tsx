import Image from 'next/image'
import { Coffee, Droplets, Sparkles, Cherry } from 'lucide-react'
import Link from 'next/link'

export default function BeverageShowcase() {
    const beverages = [
        {
            title: 'Coffee Series',
            category: 'coffee',
            description: 'Kopi pilihan premium dengan cita rasa yang khas dan aroma yang menggoda',
            image: '/images/kopi-susu.svg',
            icon: Coffee,
            gradient: 'from-[#333333] to-[#1A1A1A]',
            items: ['Es Kopi Susu', 'Kopi Gula Aren', 'Kopi Butterscotch', 'Kopi Hazelnut']
        },
        {
            title: 'Tea Series',
            category: 'tea',
            description: 'Es teh dengan kesegaran alami dan rasa yang menyegarkan sepanjang hari',
            image: '/images/Lemon Tea.svg',
            icon: Droplets,
            gradient: 'from-[#4D4D4D] to-[#333333]',
            items: ['Tea Ice', 'Lemontea', 'Thaitea', 'Greentea']
        },
        {
            title: 'Non-Coffee',
            category: 'non-coffee',
            description: 'Minuman spesial tanpa kafein dengan variasi rasa yang menarik',
            image: '/images/Coklat.svg',
            icon: Sparkles,
            gradient: 'from-[#666666] to-[#4D4D4D]',
            items: ['Oreo', 'Coklat', 'Taro Cheese', 'Matcha']
        },
        {
            title: 'Fruity Series',
            category: 'fruity',
            description: 'Kesegaran buah asli dikombinasikan dengan Yakult yang menyehatkan',
            image: '/images/Mango Yakult.svg',
            icon: Cherry,
            gradient: 'from-[#808080] to-[#666666]',
            items: ['Mango Yakult', 'Leci Yakult', 'Orange Mojito']
        }
    ]

    return (
        <section id="kategori" className="py-20 bg-linear-to-b from-white via-[#E5E5E5] to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-fadeInUp">
                    <h2 className="text-5xl md:text-6xl font-bold font-display text-kopi-primary mb-6">
                        Kategori Minuman
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Setiap minuman dibuat dengan bahan-bahan pilihan berkualitas tinggi untuk
                        memberikan pengalaman rasa terbaik untuk Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {beverages.map((beverage, index) => {
                        const Icon = beverage.icon
                        return (
                            <Link
                                key={index}
                                href={`?category=${beverage.category}#menu-lengkap`}
                                className="group card-hover bg-white rounded-3xl shadow-premium overflow-hidden block border-2 border-kopi-secondary/20 hover:border-4 hover:border-kopi-secondary transition-all duration-300"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 sm:h-80 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                                    <Image
                                        src={beverage.image || '/images/toko.svg'}
                                        alt={beverage.title}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                                        unoptimized={true}
                                    />
                                    <div className={`absolute inset-0 bg-linear-to-t ${beverage.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                                    {/* Icon Badge */}
                                    <div className={`absolute top-4 right-4 bg-linear-to-br ${beverage.gradient} p-3 rounded-full shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold font-display text-kopi-primary mb-3 group-hover:text-kopi-secondary transition-colors">
                                        {beverage.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {beverage.description}
                                    </p>

                                    {/* Popular Items */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-kopi-secondary uppercase tracking-wide">Pilihan Populer:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {beverage.items.map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-kopi-cream text-kopi-dark px-3 py-1.5 rounded-full font-medium hover:bg-kopi-accent hover:text-white transition-colors cursor-default"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Accent */}
                                <div className={`h-1.5 bg-linear-to-r ${beverage.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                            </Link>
                        )
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <a
                        href="#menu-lengkap"
                        className="inline-block btn-primary text-lg px-10 py-4"
                    >
                        Lihat Menu Lengkap
                    </a>
                </div>
            </div>
        </section>
    )
}
