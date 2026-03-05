export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number; // in cents
  image?: string;
  sizes?: string[];
  colors?: ProductColor[];
  active: boolean;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
