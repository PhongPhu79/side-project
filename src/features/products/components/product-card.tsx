"use client";

import type { Product } from "../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import { Star } from "lucide-react";
import clsx from "clsx";
import { useRef } from "react";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const hasDiscount = product.priceOriginal > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.priceOriginal - product.price) / product.priceOriginal) * 100
      )
    : 0;

  const formatVND = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

  const handleAddToCart = () => {
    addItem(product, 1);

    if (!imageRef.current) return;

    const cartEl = document.getElementById("app-cart-icon");
    if (!cartEl) return;

    const imgRect = imageRef.current.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const clone = imageRef.current.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.overflow = "hidden";
    clone.style.borderRadius = "999px";
    clone.style.boxShadow = "0 10px 40px rgba(15,23,42,0.45)";
    clone.style.transition =
      "transform 0.7s cubic-bezier(.22,.61,.36,1), opacity 0.7s ease";

    document.body.appendChild(clone);

    const translateX =
      cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const translateY =
      cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

    void clone.offsetHeight;

    clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
    clone.style.opacity = "0";

    clone.addEventListener(
      "transitionend",
      () => {
        clone.remove();
      },
      { once: true }
    );
  };

  return (
    <Card
      className="
        flex flex-col overflow-hidden rounded-2xl
        border border-slate-200 bg-white shadow-sm
        transition-all duration-200 hover:-translate-y-1 hover:shadow-md
        dark:border-slate-700 dark:bg-slate-900
      "
    >
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div
            ref={imageRef}
            className="
              relative flex aspect-4/3 items-center justify-center
             dark:bg-slate-800
            "
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />
            <span
              className="
                absolute inset-0 hidden items-center justify-center
                bg-slate-200 px-3 text-center text-xs text-slate-500
                dark:bg-slate-700 dark:text-slate-200
              "
            >
              {product.name}
            </span>
          </div>
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {product.brand}
        </div>

        <Link
          href={`/products/${product.id}`}
          className="
            line-clamp-2 text-sm font-medium
            text-slate-900 hover:text-slate-700
            dark:text-slate-50 dark:hover:text-slate-200
          "
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3 w-3 fill-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            • {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-0.5">
          <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {formatVND(product.price)}
          </div>
          {hasDiscount && (
            <div className="text-xs text-slate-400 line-through dark:text-slate-500">
              {formatVND(product.priceOriginal)}
            </div>
          )}
        </div>

        <Button
          size="sm"
          className={clsx(
            "mt-3 w-full rounded-full text-xs font-semibold cursor-pointer",
            "bg-slate-900 text-white hover:bg-slate-800",
            "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          )}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
