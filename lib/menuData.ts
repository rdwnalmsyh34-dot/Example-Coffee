export interface MenuItem {
    id: string
    name: string
    category: 'coffee' | 'non-coffee' | 'tea' | 'fruity'
    subcategory?: string
    price?: number
    variants?: Array<{ size: string; price: number }>
    description: string
    benefits: string
    image: string
    isActive: boolean
}

export const menuItems: MenuItem[] = [
    // Coffee Series
    {
        id: 'es-kopi-susu',
        name: 'Es Kopi Susu',
        category: 'coffee',
        price: 10000,
        description: 'Perpaduan sempurna antara kopi pilihan premium dengan susu segar yang creamy',
        benefits: 'Meningkatkan energi dan konsentrasi, kaya antioksidan',
        image: '/images/kopi-susu.svg',
        isActive: true
    },
    {
        id: 'kopi-gula-aren',
        name: 'Kopi Gula Aren',
        category: 'coffee',
        price: 13000,
        description: 'Kopi nikmat dengan sentuhan manis alami dari gula aren murni',
        benefits: 'Sumber energi alami, lebih sehat dari gula biasa',
        image: '/images/Kopi Susu Aren.svg',
        isActive: true
    },
    {
        id: 'kopi-butterscotch',
        name: 'Kopi Butterscotch',
        category: 'coffee',
        price: 13000,
        description: 'Kopi dengan rasa butterscotch yang manis dan creamy',
        benefits: 'Mood booster, mengurangi stress',
        image: '/images/Kopi Butterscotch.svg',
        isActive: true
    },
    {
        id: 'kopi-hazelnut',
        name: 'Kopi Hazelnut',
        category: 'coffee',
        price: 13000,
        description: 'Aroma hazelnut yang khas berpadu dengan kopi berkualitas',
        benefits: 'Meningkatkan fokus dan produktivitas',
        image: '/images/Kopi Hazelnut.svg',
        isActive: true
    },
    {
        id: 'kopi-caramel',
        name: 'Kopi Caramel',
        category: 'coffee',
        price: 13000,
        description: 'Kombinasi lezat kopi dengan sirup caramel yang manis',
        benefits: 'Energi boost, cocok untuk memulai hari',
        image: '/images/Kopi Caramel.svg',
        isActive: true
    },
    {
        id: 'moccacino',
        name: 'Moccacino',
        category: 'coffee',
        price: 13000,
        description: 'Perpaduan kopi, coklat, dan susu untuk pengalaman rasa yang indulgent',
        benefits: 'Meningkatkan mood and energi',
        image: '/images/Moccacino.svg',
        isActive: true
    },
    {
        id: 'es-kopi-hitam',
        name: 'Es Kopi Hitam Americano',
        category: 'coffee',
        subcategory: 'Americano Series',
        price: 8000,
        description: 'Kopi hitam murni tanpa gula, untuk pecinta kopi sejati',
        benefits: 'Metabolisme booster, rendah kalori',
        image: '/images/Kopi Hitam.svg',
        isActive: true
    },
    {
        id: 'kopi-lemon',
        name: 'Kopi Lemon',
        category: 'coffee',
        subcategory: 'Americano Series',
        price: 13000,
        description: 'Kombinasi fresh kopi dengan kesegaran lemon',
        benefits: 'Detox alami, meningkatkan metabolisme',
        image: '/images/Kopi Lemon.svg',
        isActive: true
    },
    {
        id: 'roca-peach-americano',
        name: 'Roca Peach Americano',
        category: 'coffee',
        subcategory: 'Americano Series',
        price: 20000,
        description: 'Americano dengan sentuhan peach yang menyegarkan',
        benefits: 'Kombinasi unik, rendah kalori',
        image: '/images/Roca Peach Americano.svg',
        isActive: true
    },
    {
        id: 'bottle-coffee',
        name: 'Bottle Coffee',
        category: 'coffee',
        variants: [
            { size: 'Kopi Susu 1 Liter', price: 65000 },
            { size: 'Kopi Susu Aren', price: 70000 }
        ],
        description: 'Kopi botol kemasan 1 Liter untuk stok di rumah, praktis dan tetap nikmat. Satu ukuran (1L) dengan pilihan rasa favorit.',
        benefits: 'Lebih hemat, stok melimpah, rasa tetap konsisten',
        image: '/images/Bottle Coffeee.svg',
        isActive: true
    },

    // Non-Coffee Series
    {
        id: 'oreo',
        name: 'Oreo',
        category: 'non-coffee',
        price: 8000,
        description: 'Minuman creamy with remahan oreo yang lezat',
        benefits: 'Mood booster, cocok untuk segala usia',
        image: '/images/Oreo.svg',
        isActive: true
    },
    {
        id: 'coklat',
        name: 'Coklat',
        category: 'non-coffee',
        price: 10000,
        description: 'Minuman coklat premium yang creamy and nikmat',
        benefits: 'Kaya antioksidan, meningkatkan mood',
        image: '/images/Coklat.svg',
        isActive: true
    },
    {
        id: 'taro-cheese',
        name: 'Taro Cheese',
        category: 'non-coffee',
        price: 12000,
        description: 'Minuman taro dengan topping cheese foam yang lembut',
        benefits: 'Sumber energi, kaya serat and kalsium',
        image: '/images/Taro Cheese.svg',
        isActive: true
    },
    {
        id: 'matcha',
        name: 'Matcha Cheese',
        category: 'non-coffee',
        price: 17000,
        description: 'Matcha premium Jepang berkualitas tinggi dengan perpaduan topping cream cheese yang gurih and lumer',
        benefits: 'Kaya antioksidan, meningkatkan fokus, and memberikan energi dari keju berkualitas',
        image: '/images/Matcha Cheese.svg',
        isActive: true
    },
    {
        id: 'susu-blueberry',
        name: 'Blueberry Milk',
        category: 'non-coffee',
        price: 13000,
        description: 'Susu segar with topping blueberry asli',
        benefits: 'Kaya vitamin C and antioksidan',
        image: '/images/Blueberry Milk.svg',
        isActive: true
    },
    {
        id: 'susu-strawberry',
        name: 'Strawberry Milk',
        category: 'non-coffee',
        price: 13000,
        description: 'Susu segar with topping strawberry segar',
        benefits: 'Tinggi vitamin C, baik untuk imunitas',
        image: '/images/Strawberry Milk.svg',
        isActive: true
    },
    {
        id: 'orange-mojito',
        name: 'Orange Mojito',
        category: 'fruity',
        price: 10000,
        description: 'Minuman segar with perpaduan jeruk and mint',
        benefits: 'Vitamin C tinggi, sangat menyegarkan',
        image: '/images/Orange Mojito.svg',
        isActive: true
    },

    // Tea Series
    {
        id: 'es-teh',
        name: 'Es Teh',
        category: 'tea',
        variants: [
            { size: 'Medium', price: 2500 },
            { size: 'Large', price: 4000 }
        ],
        description: 'Es teh manis yang segar and menyegarkan, tersedia dalam pilihan ukuran',
        benefits: 'Menghilangkan dahaga, hidrasi optimal',
        image: '/images/Es Teh Medium & Large.svg',
        isActive: true
    },
    {
        id: 'lemontea',
        name: 'Lemon Tea',
        category: 'tea',
        price: 6000,
        description: 'Teh with kesegaran lemon yang menyegarkan',
        benefits: 'Detox alami, kaya vitamin C',
        image: '/images/Lemon Tea.svg',
        isActive: true
    },
    {
        id: 'thaitea',
        name: 'Thaitea',
        category: 'tea',
        variants: [
            { size: 'Medium', price: 6000 },
            { size: 'Large', price: 10000 }
        ],
        description: 'Thai tea autentik with rasa manis creamy',
        benefits: 'Energi boost, kaya antioksidan',
        image: '/images/Thaitea Medium & Large.svg',
        isActive: true
    },
    {
        id: 'thaitea-cheese',
        name: 'Thaitea Cheese',
        category: 'non-coffee',
        price: 10000,
        description: 'Thai tea with topping cheese foam yang creamy',
        benefits: 'Fusion unik, kaya kalsium',
        image: '/images/Thaitea Cheese.svg',
        isActive: true
    },
    {
        id: 'greentea',
        name: 'Greentea',
        category: 'tea',
        variants: [
            { size: 'Medium', price: 7000 },
            { size: 'Large', price: 10000 }
        ],
        description: 'Green tea premium yang segar and sehat',
        benefits: 'Super antioksidan, metabolisme booster',
        image: '/images/Greentea Medium & Large.svg',
        isActive: true
    },
    {
        id: 'greentea-cheese',
        name: 'Greentea Cheese',
        category: 'non-coffee',
        price: 11000,
        description: 'Green tea with topping cheese foam yang lembut',
        benefits: 'Antioksidan with tambahan kalsium',
        image: '/images/Greentea Cheese.svg',
        isActive: true
    },

    // Fruity Series
    {
        id: 'mango-yakult',
        name: 'Mango Yakult',
        category: 'fruity',
        price: 8000,
        description: 'Perpaduan segar mangga manis with yakult probiotik',
        benefits: 'Probiotik untuk pencernaan, kaya vitamin',
        image: '/images/Mango Yakult.svg',
        isActive: true
    },
    {
        id: 'leci-yakult',
        name: 'Leci Yakult',
        category: 'fruity',
        price: 8000,
        description: 'Rasa leci eksotis berpadu with yakult',
        benefits: 'Vitamin C, baik untuk imunitas',
        image: '/images/Leci Yakult.svg',
        isActive: true
    },
]

export const categoryLabels = {
    coffee: 'Coffee Series',
    'non-coffee': 'Non-Coffee',
    tea: 'Tea Series',
    fruity: 'Fruity Series',
}
