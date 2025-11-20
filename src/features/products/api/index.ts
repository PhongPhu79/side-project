import type { Product } from "../types";

const PRODUCTS_URL = "/data/products.json";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Không load được danh sách sản phẩm");
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const all = await fetchProducts();
  const found = all.find((p) => p.id === id);
  if (!found) throw new Error("Không tìm thấy sản phẩm");
  return found;
}
