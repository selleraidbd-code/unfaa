export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
}

export interface ProductVariantUpdate {
  name: string;
  price: number;
  discountPrice: number;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  description: string;
  fullDescription: string;
  price: number | null;
  discountPrice: number | null;
  photoURL: string;
  keywords: string;
  stock: number;
  createdAt: string;
  activeStatus: "active" | "inactive";
  updatedAt: string;
  shopId: string;
  categoryId: string;
  productVariant: ProductVariant[];
}

export interface ProductCeratePayload {
  name: string;
  banglaName: string;
  description: string;
  fullDescription: string;
  price?: number;
  discountPrice?: number;
  photoURL: string;
  keywords: string;
  stock: number;
  activeStatus: "active" | "inactive";
  shopId: string;
  images: string[];
  categoryIds: string[];
  productVariant: ProductVariantPayload[];
}

export interface ProductVariantOption {
  name: string;
  sku: string;
  extraPrice: number;
  imgUrl?: string;
}

export interface ProductVariantPayload {
  name: string;
  productVariantOptions: ProductVariantOption[];
}
