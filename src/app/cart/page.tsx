"use client";

import { useCartStore } from "@/features/cart/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type SelectedMap = Record<string, boolean>;

export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);

    // selected items like Shopee
    const [selected, setSelected] = useState<SelectedMap>({});

    // init / sync selected when cart changes
    useEffect(() => {
        const next: SelectedMap = {};
        for (const it of items) {
            next[it.product.id] = selected[it.product.id] ?? true;
        }
        setSelected(next);
    }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const allSelected =
        items.length > 0 && items.every((it) => selected[it.product.id]);

    const toggleItem = (id: string) => {
        setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleAll = () => {
        if (allSelected) {
            // unselect all
            const next: SelectedMap = {};
            items.forEach((it) => {
                next[it.product.id] = false;
            });
            setSelected(next);
        } else {
            // select all
            const next: SelectedMap = {};
            items.forEach((it) => {
                next[it.product.id] = true;
            });
            setSelected(next);
        }
    };

    const selectedItems = items.filter((it) => selected[it.product.id]);
    const selectedCount = selectedItems.length;
    const selectedTotal = selectedItems.reduce(
        (sum, it) => sum + it.product.price * it.quantity,
        0,
    );

    if (!items.length) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-14 text-center text-sm">
                <h1 className="mb-4 text-3xl font-semibold">Your Cart</h1>
                <p className="text-slate-600">Your cart is currently empty.</p>
                <Button asChild className="mt-5 rounded-full px-6 py-2">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
            <h1 className="mb-6 text-3xl font-bold text-slate-900">Your Cart</h1>

            {/* HEADER ROW */}
            <div className="mb-3 hidden items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-medium text-slate-500 md:flex">
                <div className="flex w-1/2 items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
                            checked={allSelected}
                            onChange={toggleAll}
                        />
                        <span>
                            Select all ({items.length})
                        </span>
                    </label>
                </div>
                <div className="flex w-1/2 items-center justify-end gap-8">
                    <span className="w-28 text-right">Unit price</span>
                    <span className="w-32 text-center">Quantity</span>
                    <span className="w-32 text-right">Total</span>
                    <span className="w-16 text-center">Action</span>
                </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
                {items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    const id = item.product.id;
                    const isChecked = !!selected[id];

                    return (
                        <div
                            key={id}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
                        >
                            {/* LEFT: checkbox + image + basic info */}
                            <div className="flex flex-1 items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
                                    checked={isChecked}
                                    onChange={() => toggleItem(id)}
                                />

                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                    <img
                                        src={item.product.thumbnail}
                                        alt={item.product.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <div className="min-w-0 flex-1 text-sm">
                                    <div className="line-clamp-2 font-semibold text-slate-900">
                                        {item.product.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {item.product.brand} • {item.product.category}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: price / qty / total / action */}
                            <div className="flex flex-col items-end gap-3 text-sm md:w-[340px] md:flex-row md:items-center md:justify-end md:gap-6">
                                {/* Unit price */}
                                <div className="flex w-28 justify-end text-slate-700">
                                    <span className="whitespace-nowrap">
                                        {item.product.price.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>

                                {/* Quantity controller */}
                                <div className="flex w-32 justify-center">
                                    <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-2 py-1">
                                        <button
                                            className="p-1 text-slate-600 hover:text-slate-900  cursor-pointer"
                                            onClick={() =>
                                                updateQuantity(id, Math.max(1, item.quantity - 1))
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="mx-3 w-6 text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="p-1 text-slate-600 hover:text-slate-900  cursor-pointer"
                                            onClick={() => updateQuantity(id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Line total (FIX: nowrap so it doesn’t wrap) */}
                                <div className="flex w-32 justify-end font-semibold text-slate-900">
                                    <span className="whitespace-nowrap">
                                        {lineTotal.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>

                                {/* Remove */}
                                <div className="flex w-16 justify-center">
                                    <button
                                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600 cursor-pointer"
                                        onClick={() => removeItem(id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="hidden md:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FOOTER SUMMARY (Shopee-style) */}
            <div className="sticky bottom-0 mt-6 border-t border-slate-200 bg-white/90 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-sm md:flex-row md:justify-between">
                    {/* left: select all + count */}
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
                                checked={allSelected}
                                onChange={toggleAll}
                            />
                            <span>Select all</span>
                        </label>
                        <span className="text-slate-500">
                            Selected{" "}
                            <span className="font-semibold text-slate-900">
                                {selectedCount}
                            </span>{" "}
                            / {items.length} item(s)
                        </span>
                    </div>

                    {/* right: total & button */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        <div className="text-right text-sm">
                            <div className="text-slate-500">
                                Total{" "}
                                <span className="font-semibold text-slate-900">
                                    ({selectedCount} item
                                    {selectedCount !== 1 ? "s" : ""})
                                </span>
                            </div>
                            <div className="text-lg font-bold text-emerald-600 whitespace-nowrap">
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
    );
}
