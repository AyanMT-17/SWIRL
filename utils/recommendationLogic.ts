import { Product } from '@/constants/mockData';
import { UserPreferences } from '@/contexts/UserPreferencesContext';

// Weightage Configuration (Matching Backend Logic)
export const ATTRIBUTE_WEIGHTS = {
    STYLE: 30,
    COLOR: 25,
    CATEGORY: 15,
    BRAND: 10,
    FIT: 10,
    FABRIC: 5,
    OCCASION: 5,
};

// Types
interface ScoredProduct extends Product {
    score: number;
    matchReasons: string[];
}

/**
 * Calculates a relevance score for a product based on user preferences.
 * Implements the 7-attribute weightage logic.
 */
export const calculateProductScore = (product: Product, preferences: UserPreferences | null): number => {
    if (!preferences) return 0;

    let score = 0;
    const { likes = [], dislikes = [], gender, size } = preferences;

    // 1. HARD FILTERS (Gender & Size) - If backend didn't filter, we must.
    // Note: Assuming 'Men'/'Women' string matching.
    // In a real app, products should have a gender field. 
    // Current Product interface doesn't have gender! 
    // We will skip strict gender filtering if data is missing to avoid empty feed,
    // or infer it from category (e.g. "dress" -> Women).

    // 2. DISLIKES (Negative Infinity / Exclusion)
    const productText = [
        product.name,
        product.brand,
        product.category,
        ...(product.categories || []),
        product.properties?.style || '',
        product.properties?.color_family || '',
        product.description
    ].join(' ').toLowerCase();

    const hasDislike = dislikes.some(dislike => productText.includes(dislike.toLowerCase()));
    if (hasDislike) return -10000; // Push to bottom or filter out

    // 3. LIKES (Scoring)
    likes.forEach(like => {
        const likeLower = like.toLowerCase();

        // Check attributes with weights

        // Style (30)
        const style = product.properties?.style || '';
        if (style.toLowerCase().includes(likeLower)) {
            score += ATTRIBUTE_WEIGHTS.STYLE;
        }

        // Color (25)
        // Check both mapped color family and descriptive text/name which might have specific color
        const color = product.properties?.color_family || '';
        if (color.toLowerCase().includes(likeLower) || product.name.toLowerCase().includes(likeLower + ' ')) {
            score += ATTRIBUTE_WEIGHTS.COLOR;
        }

        // Category (15)
        const category = product.category || '';
        const categories = (product.categories || []).map(c => c.toLowerCase());
        if (category.toLowerCase().includes(likeLower) || categories.some(c => c.includes(likeLower))) {
            score += ATTRIBUTE_WEIGHTS.CATEGORY;
        }

        // Brand (10)
        if (product.brand.toLowerCase().includes(likeLower)) {
            score += ATTRIBUTE_WEIGHTS.BRAND;
        }

        // Fit (10)
        const fit = product.properties?.fit || '';
        if (fit.toLowerCase().includes(likeLower)) {
            score += ATTRIBUTE_WEIGHTS.FIT;
        }

        // Fabric (5)
        const fabric = product.properties?.fabric || '';
        if (fabric.toLowerCase().includes(likeLower)) {
            score += ATTRIBUTE_WEIGHTS.FABRIC;
        }

        // Occasion (5)
        const occasion = product.properties?.occasion || '';
        if (occasion.toLowerCase().includes(likeLower)) {
            score += ATTRIBUTE_WEIGHTS.OCCASION;
        }
    });

    return score;
};

/**
 * Sorts products by relevance score.
 */
export const sortProductsByRelevance = (products: Product[], preferences: UserPreferences | null): Product[] => {
    if (!products.length || !preferences) return products;

    // Map to scored objects to avoid re-calculating
    const scored = products.map(p => ({
        product: p,
        score: calculateProductScore(p, preferences)
    }));

    // Filter out dislikes (score < 0)
    const filtered = scored.filter(item => item.score >= -100);

    // Sort descending
    filtered.sort((a, b) => b.score - a.score);

    return filtered.map(item => item.product);
};
