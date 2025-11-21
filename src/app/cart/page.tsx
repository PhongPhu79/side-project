"use client";

import { useCartStore } from "@/features/cart/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";

type SelectedMap = Record<string, boolean>;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [selectedOverrides, setSelectedOverrides] = useState<SelectedMap>({});

  const selected = useMemo(() => {
    const result: SelectedMap = {};
    for (const it of items) {
      const id = it.product.id;
      result[id] = selectedOverrides[id] ?? true;
    }
    return result;
  }, [items, selectedOverrides]);

  const allSelected =
    items.length > 0 && items.every((it) => selected[it.product.id]);

  const toggleItem = (id: string) => {
    setSelectedOverrides((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? true),
    }));
  };

  const toggleAll = () => {
    if (allSelected) {
      const next: SelectedMap = {};
      items.forEach((it) => (next[it.product.id] = false));
      setSelectedOverrides(next);
    } else {
      const next: SelectedMap = {};
      items.forEach((it) => (next[it.product.id] = true));
      setSelectedOverrides(next);
    }
  };

  const selectedItems = items.filter((it) => selected[it.product.id]);
  const selectedCount = selectedItems.length;
  const selectedTotal = selectedItems.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );

  if (!items.length) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <div className="container-app px-4 py-14 text-center text-sm">
          <h1 className="mb-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">
            Your Cart
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Your cart is currently empty.
          </p>
          <Button
            asChild
            className="mt-5 rounded-full px-6 py-2 text-sm font-semibold"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-50">
      <div className="px-4 md:px-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span>/</span>
          <Link
            href="/"
            className="transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            Products
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Your Cart
          </span>
        </div>

        <div
          className="
            container-app mx-auto max-w-5xl
            flex flex-col gap-4 md:gap-6
            max-h-[calc(100vh-160px)]  /* header + title + padding */
          "
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Your Cart
          </h1>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="mb-3 hidden items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-medium text-slate-500 shadow-sm md:flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex w-1/2 items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-slate-500"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <span>Select all ({items.length})</span>
                </label>
              </div>
              <div className="flex w-1/2 items-center justify-end gap-8">
                <span className="w-28 text-right">Unit price</span>
                <span className="w-32 text-center">Quantity</span>
                <span className="w-32 text-right">Total</span>
                <span className="w-16 text-center">Action</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 pb-3">
              {items.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                const id = item.product.id;
                const isChecked = selected[id];

                return (
                  <div
                    key={id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-slate-500"
                        checked={isChecked}
                        onChange={() => toggleItem(id)}
                      />

                      <Link
                        href={`/products/${id}`}
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                      >
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </Link>

                      <div className="min-w-0 flex-1 text-sm">
                        <Link
                          href={`/products/${id}`}
                          className="line-clamp-2 font-semibold text-slate-900 transition hover:text-sky-600 dark:text-slate-50 dark:hover:text-sky-400"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.product.brand} • {item.product.category}
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 w-full text-sm md:mt-0 md:w-[480px] md:grid md:grid-cols-[110px_140px_120px_60px] md:items-center md:gap-4">
                      <div className="flex items-center justify-between md:block">
                        <span className="text-xs text-slate-400 md:hidden dark:text-slate-500">
                          Unit price
                        </span>
                        <div className="whitespace-nowrap text-slate-700 md:text-right dark:text-slate-100">
                          {item.product.price.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between md:mt-0 md:justify-center">
                        <span className="mr-3 text-xs text-slate-400 md:hidden dark:text-slate-500">
                          Quantity
                        </span>
                        <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-2 py-1 dark:border-slate-600 dark:bg-slate-800">
                          <button
                            className="cursor-pointer p-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                            onClick={() =>
                              updateQuantity(id, Math.max(1, item.quantity - 1))
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 w-6 text-center text-sm font-medium text-slate-900 dark:text-slate-50">
                            {item.quantity}
                          </span>
                          <button
                            className="cursor-pointer p-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                            onClick={() =>
                              updateQuantity(id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between md:mt-0 md:block">
                        <span className="text-xs text-slate-400 md:hidden dark:text-slate-500">
                          Total
                        </span>
                        <div className="whitespace-nowrap font-semibold text-slate-900 md:text-right dark:text-slate-50">
                          {lineTotal.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>

                      <div className="mt-2 flex justify-end md:mt-0">
                        <button
                          className="inline-flex items-center gap-1 cursor-pointer text-xs font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                          onClick={() => removeItem(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden md:inline">Remove</span>
                          <span className="md:hidden">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="mt-2 mb-4 h-px w-full border-0 bg-slate-200 dark:bg-slate-700" />

            <div className="shrink-0 ">
              <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-sm md:flex-row md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-slate-500"
                      checked={allSelected}
                      onChange={toggleAll}
                    />
                    <span>Select all</span>
                  </label>
                  <span className="text-slate-500 dark:text-slate-400">
                    Selected{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {selectedCount}
                    </span>{" "}
                    / {items.length} item(s)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="text-right text-sm">
                    <div className="text-slate-500 dark:text-slate-400">
                      Total{" "}
                      <span className="font-semibold text-slate-900 dark:text-slate-50">
                        ({selectedCount} item
                        {selectedCount !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <div className="whitespace-nowrap text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedTotal.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    disabled={selectedCount === 0}
                    className="min-w-[220px] rounded-full px-6 py-2.5 text-base font-semibold shadow-sm"
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
