export type Category = "cadenas" | "pulseras" | "anillos" | "dijes" | "coleccion-marina";

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
  material: string; // ej: "Acero Inoxidable 316L"
  waterproof: boolean;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
}
