"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api";
import type { Product } from "../types";

export function useProductDetail(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}
