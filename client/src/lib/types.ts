export type Role = "ADMIN" | "SELLER" | "CUSTOMER";

export interface Address {
  id: string;
  _id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  addresses?: Address[];
  emailVerified?: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  user: { name: string };
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  shortDesc: string;
  description: string;
  fabric: string;
  color: string;
  fit: string;
  sleeve: string;
  pattern: string;
  collar: string;
  gsm?: string;
  stock: number;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  seller?: { id: string; name: string };
  rating?: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  size: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shipping?: {
    line1: string; city: string; state: string;
  };
}
