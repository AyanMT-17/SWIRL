
import rawData from './processed_mock_data.json';

export const MOCK_CATEGORIES = [
    {
        id: '1',
        name: 'New Arrivals',
        image_url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'new-arrivals'
    },
    {
        id: '2',
        name: 'Streetwear',
        image_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'streetwear'
    },
    {
        id: '3',
        name: 'Accessories',
        image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'accessories'
    },
    {
        id: '4',
        name: 'Sneakers',
        image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'sneakers'
    },
    {
        id: '5',
        name: 'Vintage',
        image_url: 'https://images.pexels.com/photos/6064683/pexels-photo-6064683.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'vintage'
    },
    {
        id: '6',
        name: 'Denim',
        image_url: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=400',
        slug: 'denim'
    }
];

const BRAND_LOGOS: Record<string, string> = {
    'Roadster': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Roadster_Logos.png',
    'H&M': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png',
    'HRX by Hrithik Roshan': 'https://upload.wikimedia.org/wikipedia/commons/2/28/HRX_Logo.png',
    'WROGN': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Wrogn_Logo.png',
    'Nike': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
    'Adidas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png',
    'Puma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Puma-logo-1.png/640px-Puma-logo-1.png',
    'Zara': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
    'Levis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png',
    'Tommy Hilfiger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tommy_Hilfiger_Logo.svg/1200px-Tommy_Hilfiger_Logo.svg.png',
    'Jack & Jones': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Jack_%26_Jones_Logo.svg/2560px-Jack_%26_Jones_Logo.svg.png',
    'U.S. Polo Assn.': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/U.S._Polo_Assn._Logo.png',
    'Mango': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Mango_logo.svg/2560px-Mango_logo.svg.png',
    'Forever 21': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Forever_21_logo.svg/2560px-Forever_21_logo.svg.png',
    'Biba': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Biba_Logo.png',
    'Kalini': 'https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2022/1/21/f89415cc-281b-426b-8041-3563935272371642749948013-Kalini-Logo.jpg',
    'Libas': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Libas_Logo.png',
    'Anouk': 'https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2022/4/19/2d6999b8-b4b6-45c1-9689-53e7d6928e1d1650369865180-Anouk.jpg'
};

// Use the generated brand list but override logos with high-quality ones where available
export const PREMIUM_BRANDS = rawData.brands.map((b: any) => ({
    ...b,
    logo: BRAND_LOGOS[b.name] || b.logo
}));


// Export key types so they can be used in the context
export interface ProductProperties {
    style: 'streetwear' | 'casual' | 'formal' | 'vintage' | 'minimalist' | 'bohemian' | 'sporty';
    price_tier: 'budget' | 'mid' | 'premium' | 'luxury';
    color_family: 'monochrome' | 'earth' | 'pastel' | 'vibrant' | 'dark' | 'light';
    category: 'top' | 'bottom' | 'footwear' | 'outerwear' | 'dress' | 'accessories';
    fit: 'oversized' | 'regular' | 'slim' | 'relaxed';
    fabric: 'cotton' | 'denim' | 'polyester' | 'wool' | 'leather' | 'silk' | 'synthetic';
    occasion: 'daily' | 'party' | 'work' | 'vacation' | 'active';
    season: 'summer' | 'winter' | 'all_year';
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price: number;
    discount_percentage: number;
    product_images: { image_url: string }[];
    category: string;
    categories: string[];
    has_free_delivery: boolean;
    delivery_date: string;
    description: string;
    properties: ProductProperties; // Added properties
}

// Helper to assign random properties for mock data
const getRandomProperty = <T>(options: T[]): T => {
    return options[Math.floor(Math.random() * options.length)];
};

const assignProperties = (product: any): Product => {
    // Basic logic to guess price tier
    let price_tier: ProductProperties['price_tier'] = 'mid';
    if (product.price < 1000) price_tier = 'budget';
    else if (product.price > 10000) price_tier = 'luxury';
    else if (product.price > 5000) price_tier = 'premium';

    // Basic logic to guess category if visible
    let category: ProductProperties['category'] = 'top';
    const lowerName = product.name.toLowerCase();
    const lowerCat = product.category.toLowerCase();

    if (lowerCat.includes('foot') || lowerCat.includes('shoes') || lowerName.includes('sneaker') || lowerName.includes('shoe')) category = 'footwear';
    else if (lowerCat.includes('bottom') || lowerName.includes('pant') || lowerName.includes('short') || lowerName.includes('jeans')) category = 'bottom';
    else if (lowerName.includes('dress')) category = 'dress';
    else if (lowerName.includes('jacket') || lowerName.includes('coat') || lowerName.includes('hoodie')) category = 'outerwear';
    else if (lowerName.includes('bag') || lowerName.includes('watch') || lowerName.includes('belt')) category = 'accessories';

    return {
        ...product,
        properties: {
            style: getRandomProperty(['streetwear', 'casual', 'formal', 'vintage', 'minimalist', 'bohemian', 'sporty']),
            price_tier,
            color_family: getRandomProperty(['monochrome', 'earth', 'pastel', 'vibrant', 'dark', 'light']),
            category,
            fit: getRandomProperty(['oversized', 'regular', 'slim', 'relaxed']),
            fabric: getRandomProperty(['cotton', 'denim', 'polyester', 'wool', 'leather', 'synthetic']),
            occasion: getRandomProperty(['daily', 'party', 'work', 'vacation', 'active']),
            season: getRandomProperty(['summer', 'winter', 'all_year'])
        }
    };
};

// Export the generated products enriched with properties
export const MOCK_PRODUCTS: Product[] = rawData.products.map(assignProperties);

