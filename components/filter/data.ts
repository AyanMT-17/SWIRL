export interface FilterState {
    selectedCategory: string;
    selectedItems: { [key: string]: string[] };
    searchQuery: string;
    priceMin: string;
    priceMax: string;
}

export const FILTER_CATEGORIES = [
    'Brands',
    'Size',
    'Top',
    'Bottom',
    'Price',
    'Shoes',
    'Accessories',
    'Dress',
    'Lifestyle',
    'Color',
];

export const generateBrandData = () => {
    const data: { [key: string]: string[] } = {
        'Popular Brands': ['Roadster', 'HRX by Hrithik Roshan', 'Nike', 'H&M', 'Miniorange'],
        'A': ['Adidas', 'Allen Solly', 'Arrow'],
        'B': ['Biba', 'Blackberrys'],
        'C': ['Calvin Klein', 'Campus'],
        'L': ['Levis', 'Louis Philippe'],
        'P': ['Puma', 'Peter England'],
        'R': ['Raymond', 'Reebok'],
        'U': ['Under Armour', 'United Colors of Benetton'],
        'V': ['Van Heusen', 'Vero Moda'],
        'W': ['W', 'Woodland'],
        'Z': ['Zara', 'Zivame']
    };

    return data;
};

export const BRAND_DATA = generateBrandData();

export const CLOTHING_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
export const SHOE_SIZE_OPTIONS = ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
export const TOP_OPTIONS = ['Shirts', 'T-Shirts', 'Jackets', 'Sweaters', 'Sweatshirts', 'Hoodie', 'Kurta', 'Zippers'];
export const BOTTOM_OPTIONS = ['Denims', 'Chinos', 'Cargos', 'Joggers', 'Trousers', 'Pants', 'Pajamas', 'Shorts'];
export const PRICE_RANGES = [
    'Below Rs.500',
    'Rs.500 - Rs.1000',
    'Rs.1001 - Rs.1500',
    'Rs.1501 - Rs.2000',
    'Rs.2000 - Rs.2500',
    'Rs.2501 - Rs.5000',
    'Rs.5001 - Rs.10000',
    'Above Rs.10000',
];
export const SHOES_OPTIONS = ['Sneakers', 'Loafers', 'Boots', 'Sandals', 'Formal Shoes', 'Sports Shoes', 'Slip-ons', 'High Tops'];
export const ACCESSORIES_OPTIONS = ['Watches', 'Bags', 'Belts', 'Wallets', 'Sunglasses', 'Caps', 'Scarves', 'Ties'];
export const DRESS_OPTIONS = ['Casual Dress', 'Formal Dress', 'Party Wear', 'Traditional', 'Western', 'Maxi', 'Mini', 'Midi'];
export const LIFESTYLE_OPTIONS = ['Sports', 'Casual', 'Formal', 'Ethnic', 'Street Style', 'Bohemian', 'Minimalist', 'Vintage'];
export const COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Grey', 'Brown', 'Navy', 'Beige', 'Orange'];
