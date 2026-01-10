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

export const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Oversized Hoodie',
        price: 4500,
        original_price: 6000,
        brand: 'ESSENTIALS',
        category: 'Top',
        has_free_delivery: true,
        delivery_date: 'Tomorrow, Dec 14',
        discount_percentage: 25,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'High quality cotton blend oversized hoodie for maximum comfort and style.',
    },
    {
        id: '2',
        name: 'Cargo Pants',
        price: 3500,
        original_price: null,
        brand: 'NIKE',
        category: 'Bottom',
        has_free_delivery: false,
        delivery_date: 'Mon, Dec 16',
        discount_percentage: null,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Durable and stylish cargo pants with multiple pockets.',
    },
    {
        id: '3',
        name: 'Retro Sneakers',
        price: 8500,
        original_price: 9500,
        brand: 'NEW BALANCE',
        category: 'Footwear',
        has_free_delivery: true,
        delivery_date: 'Sun, Dec 15',
        discount_percentage: 10,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Classic retro style sneakers with modern comfort technology.',
    },
    {
        id: '4',
        name: 'Graphic Tee',
        price: 1500,
        original_price: 2000,
        brand: 'STUSSY',
        category: 'Top',
        has_free_delivery: true,
        delivery_date: 'Tomorrow, Dec 14',
        discount_percentage: 25,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Cotton t-shirt with unique graphic print.',
    },
    {
        id: '5',
        name: 'Varsity Jacket',
        price: 12000,
        original_price: 15000,
        brand: 'OFF-WHITE',
        category: 'Premium',
        has_free_delivery: true,
        delivery_date: 'Tue, Dec 17',
        discount_percentage: 20,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Premium wool blend varsity jacket with leather sleeves.',
    },
    {
        id: '6',
        name: 'Denim Jacket',
        price: 5500,
        original_price: null,
        brand: 'LEVIS',
        category: 'Top',
        has_free_delivery: true,
        delivery_date: 'Tomorrow, Dec 14',
        discount_percentage: null,
        product_images: [{ image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Classic fit denim jacket in vintage wash.',
    },
    {
        id: '7',
        name: 'Beanie',
        price: 1200,
        original_price: 1500,
        brand: 'CARHARTT',
        category: 'Accessories',
        has_free_delivery: false,
        delivery_date: 'Wed, Dec 18',
        discount_percentage: 20,
        product_images: [{ image_url: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Warm acrylic knit beanie with logo patch.',
    },
    {
        id: '8',
        name: 'Running Shoes',
        price: 9500,
        original_price: null,
        brand: 'ADIDAS',
        category: 'Footwear',
        has_free_delivery: true,
        delivery_date: 'Tomorrow, Dec 14',
        discount_percentage: null,
        product_images: [{ image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800' }],
        description: 'Lightweight running shoes with boost technology.',
    }
];

export const PREMIUM_BRANDS = [
    {
        id: 'pb1',
        name: 'Gucci',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Gucci-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb2',
        name: 'Prada',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Prada-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb3',
        name: 'Versace',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Versace-Logo-768x480.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb4',
        name: 'Dior',
        logo: 'https://1000logos.net/wp-content/uploads/2021/05/Dior-logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb5',
        name: 'Chanel',
        logo: 'https://1000logos.net/wp-content/uploads/2020/07/Chanel-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb6',
        name: 'Saint Laurent',
        logo: 'https://1000logos.net/wp-content/uploads/2020/04/Saint-Laurent-Logo-768x480.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb7',
        name: 'Fendi',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Fendi-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb8',
        name: 'Givenchy',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Givenchy-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb9',
        name: 'Hermès',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Hermes-Logo-768x432.png',
        category: 'Luxury Fashion'
    },
    {
        id: 'pb10',
        name: 'Valentino',
        logo: 'https://1000logos.net/wp-content/uploads/2020/09/Valentino-Logo-768x432.png',
        category: 'Luxury Fashion'
    }
];

