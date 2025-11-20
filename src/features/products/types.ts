export type ProductCategory =
  | "Headphone"
  | "Laptop"
  | "Phone"
  | "Watch"
  | "Accessory"
  | "Tablet"
  | "Camera"
  | "Console"
  | string;

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceOriginal: number;
  thumbnail: string;
  subtitle: string;
  description: string[];
  specs: ProductSpec[];
  images?: string[];
  category: ProductCategory;
  rating: number;
  stock: number;
  isNew: boolean;
  isHot: boolean;
  tags: string[];
  sold?: number;
  salePercent?: number;
};
