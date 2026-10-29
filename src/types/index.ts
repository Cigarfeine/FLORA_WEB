export type ProductCategory = 'all' | 'pots' | 'plants' | 'artificial' | 'hampers';

export interface Product {
  id: string;
  name: string;
  category: 'pots' | 'plants' | 'artificial' | 'hampers';
  price: number;
  originalPrice?: number;
  badge?: string;
  description: string;
  dimensions?: string;
  image: string;
  inStock: boolean;
  careLevel?: 'Easy' | 'Moderate' | 'Low Care' | 'Zero Maintenance';
  lightRequirement?: 'Bright Indirect' | 'Low to Medium Light' | 'Full Sun' | 'Any Environment';
  features?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPotColor?: string;
}

export interface VideoReel {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  duration?: string;
  featuredProductName?: string;
  featuredProductPrice?: number;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  source: 'Google Review' | 'Instagram Direct' | 'Justdial Verified';
}
