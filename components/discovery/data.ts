export interface LocationCard {
    id: string;
    name: string;
    image: string;
}

export interface FashionCard {
    id: string;
    name: string;
    image: string;
}

export interface LifestyleCard {
    id: string;
    name: string;
    image: string;
}

export interface BrandCard {
    id: string;
    name: string;
    logo: string;
}

export const nearYouData: LocationCard[] = [
    {
        id: '1',
        name: 'Hyderabad',
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '2',
        name: 'Kashmir',
        image: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '3',
        name: 'Maharashtra',
        image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '4',
        name: 'Delhi',
        image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '5',
        name: 'Mumbai',
        image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
];

export const trendingFashionData: FashionCard[] = [
    {
        id: '1',
        name: 'Korean',
        image: 'https://images.pexels.com/photos/1549974/pexels-photo-1549974.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '2',
        name: '',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '3',
        name: 'Old Money',
        image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
];

export const lifestyleData: LifestyleCard[] = [
    {
        id: '1',
        name: 'Summer',
        image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '2',
        name: 'Work',
        image: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: '3',
        name: 'Vacation',
        image: 'https://images.pexels.com/photos/1042423/pexels-photo-1042423.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
];

export const myBrandsData: BrandCard[] = [
    { id: '1', name: 'H&M', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png' },
    { id: '2', name: 'ZARA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png' },
    { id: '3', name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png' },
];
