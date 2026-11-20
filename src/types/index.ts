export type Category =
  | "coleccion-marina"
  | "cadenas"
  | "pulseras"
  | "anillos"
  | "aretes"
  | "dijes"
  | (string & {});

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // En COP
  originalPrice?: number;
  category: Category;
  categoryName: string;
  images: string[];
  isFeatured?: boolean;
  material: string;
  waterproof: boolean;
  inStock: boolean;
  stockQuantity: number;
}

export interface ProductImageItem {
  id: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface AdminProduct extends Product {
  isActive: boolean;
  sku?: string;
  imageRecords?: ProductImageItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
