"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api";
import type { Product } from "../types";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
