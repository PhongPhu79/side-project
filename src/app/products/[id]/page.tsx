"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCartStore } from "@/features/cart/store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Star } from "lucide-react";

type LocalReview = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
};

const MOCK_REVIEWS: LocalReview[] = [
    {
        id: "r1",
        name: "Minh Nguyen",
        rating: 5,
        comment:
            "The product quality is great, packaging is secure and delivery is fast. Very satisfied!",
        createdAt: "2024-11-01",
    },
    {
        id: "r2",
        name: "Thao Tran",
        rating: 4,
        comment:
            "Nice design and comfortable to use. Price is a bit high but worth it overall.",
        createdAt: "2024-11-03",
    },
    {
        id: "r3",
        name: "Quoc Le",
        rating: 5,
        comment: "Good sound quality, solid build, battery is fine.",
        createdAt: "2024-11-05",
    },
];

function buildRatingDistribution(rating: number, reviews: LocalReview[]) {
    const total = reviews.length || 1;
    const base = [0, 0, 0, 0, 0]; // 1★ → 5★

    const high = Math.round(total * (rating > 4.7 ? 0.7 : 0.55));
    const mid = Math.round(total * 0.25);
    const low = total - high - mid;

    base[4] = high;
    base[3] = mid;
    base[2] = low;

    return [5, 4, 3, 2, 1].map((s, idx) => {
        const i = 4 - idx;
        return {
            star: s,
            count: base[i],
            percent: total > 0 ? Math.round((base[i] / total) * 100) : 0,
        };
    });
}

const formatVND = (n: number) => n.toLocaleString("vi-VN") + " ₫";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { data, isLoading } = useProducts();
    const addItem = useCartStore((s) => s.addItem);

    const [localReviews, setLocalReviews] =
        useState<LocalReview[]>(MOCK_REVIEWS);
    const [reviewName, setReviewName] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // ref for main image to get position when flying to cart
    const mainImgRef = useRef<HTMLImageElement | null>(null);

    const product = useMemo(
        () => data?.find((p) => p.id === params.id),
        [data, params.id]
    );

    if (isLoading) {
        return (
            <div className="py-16 text-center text-sm text-slate-500">
                Loading product information...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="space-y-4 py-16">
                <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </button>
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                    Product not found. It may have been removed or the URL is incorrect.
                </div>
            </div>
        );
    }

    const hasDiscount = product.priceOriginal > product.price;
    const discountPercent = hasDiscount
        ? Math.round(
            ((product.priceOriginal - product.price) / product.priceOriginal) * 100
        )
        : 0;

    const ratingDist = buildRatingDistribution(product.rating, localReviews);
    const gallery = [
        product.thumbnail,
        product.thumbnail,
        product.thumbnail,
        product.thumbnail,
    ];

    const flyToCart = () => {
        const cartEl = document.getElementById("app-cart-icon");
        const imgEl = mainImgRef.current;

        if (!cartEl || !imgEl) return;

        const cartRect = cartEl.getBoundingClientRect();
        const imgRect = imgEl.getBoundingClientRect();

        const clone = imgEl.cloneNode(true) as HTMLImageElement;
        clone.style.position = "fixed";
        clone.style.left = imgRect.left + imgRect.width / 2 + "px";
        clone.style.top = imgRect.top + imgRect.height / 2 + "px";
        clone.style.width = "150px";
        clone.style.height = "150px";
        clone.style.borderRadius = "999px";
        clone.style.zIndex = "9999";
        clone.style.pointerEvents = "none";
        clone.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
        clone.style.transform = "translate(-50%, -50%) scale(1)";
        clone.style.opacity = "0.9";

        document.body.appendChild(clone);

        const targetX = cartRect.left + cartRect.width / 2;
        const targetY = cartRect.top + cartRect.height / 2;

        const deltaX = targetX - (imgRect.left + imgRect.width / 2);
        const deltaY = targetY - (imgRect.top + imgRect.height / 2);

        requestAnimationFrame(() => {
            clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
            clone.style.opacity = "0";
        });

        clone.addEventListener(
            "transitionend",
            () => {
                clone.remove();
            },
            { once: true }
        );
    };

    const handleAddToCart = () => {
        if (quantity <= 0) return;
        addItem(product, quantity);
        flyToCart();
    };

    const handleBuyNow = () => {
        if (quantity <= 0) return;
        addItem(product, quantity);
        flyToCart();
        router.push("/checkout");
    };

    const submitReview = () => {
        if (!reviewName.trim() || !reviewComment.trim()) {
            setReviewError("Please enter your name and review content.");
            return;
        }
        setReviewError(null);

        const newReview: LocalReview = {
            id: "local-" + Date.now(),
            name: reviewName.trim(),
            rating: reviewRating,
            comment: reviewComment.trim(),
            createdAt: new Date().toISOString().slice(0, 10),
        };

        setLocalReviews((prev) => [newReview, ...prev]);
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
    };

    // description support: string or string[]
    const descriptionBlocks: string[] = (() => {
        const desc: any = (product as any).description;
        if (!desc) return [];
        if (Array.isArray(desc)) return desc;
        if (typeof desc === "string") {
            return desc
                .split(/\n+/)
                .map((s: string) => s.trim())
                .filter(Boolean);
        }
        return [];
    })();

    const specs: { label: string; value: string }[] =
        ((product as any).specs as { label: string; value: string }[]) ?? [];

    return (
        <div className="space-y-10">
            {/* Breadcrumb */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                </button>
                <span>/</span>
                <span
                    className="cursor-pointer hover:text-slate-900"
                    onClick={() => router.push("/")}
                >
                    Products
                </span>
                <span>/</span>
                <span className="line-clamp-1 font-medium text-slate-900">
                    {product.name}
                </span>
            </div>

            {/* HERO: Shopee / Lazada style layout but neutral colors */}
            <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 lg:grid-cols-[1.05fr_1.6fr]">
                {/* LEFT — Gallery */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    <div className="hidden w-20 shrink-0 flex-col gap-2 sm:flex">
                        {gallery.map((img, i) => (
                            <button
                                key={i}
                                className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 hover:border-slate-400"
                            >
                                <img
                                    src={img}
                                    alt=""
                                    className="h-16 w-full object-contain p-1.5"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <img
                                ref={mainImgRef}
                                src={product.thumbnail}
                                alt={product.name}
                                className="h-full w-full object-contain p-4"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT — Product info */}
                <div className="flex flex-col gap-4">
                    {/* Title + brand */}
                    <div>
                        <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
                            {product.brand} • {product.category}
                        </p>
                        <h1 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg md:text-xl">
                            {product.name}
                        </h1>
                        {(product as any).subtitle && (
                            <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm">
                                {(product as any).subtitle}
                            </p>
                        )}
                    </div>

                    {/* Rating row */}
                    <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-3 text-xs">
                        <div className="flex items-center gap-1 text-amber-500">
                            <span className="flex items-center gap-0.5">
                                <Star className="h-3.5 w-3.5 fill-amber-400" />
                                <span className="font-semibold">
                                    {product.rating.toFixed(1)}
                                </span>
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                            ({localReviews.length} reviews)
                        </span>
                        <span className="h-3 w-px bg-slate-200" />
                        <span className="text-[11px] text-slate-500">
                            Sold:{" "}
                            <span className="font-semibold text-slate-700">
                                {Math.max(localReviews.length * 3, 10)}
                            </span>
                        </span>
                        {product.isNew && (
                            <>
                                <span className="h-3 w-px bg-slate-200" />
                                <span className="rounded-sm bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                                    New arrival
                                </span>
                            </>
                        )}
                        {product.isHot && (
                            <span className="rounded-sm bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                                Best seller
                            </span>
                        )}
                    </div>

                    {/* Price block – neutral palette */}
                    <div className="rounded-md bg-slate-50 px-4 py-3 text-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-3xl font-semibold text-slate-900">
                                {formatVND(product.price)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-xs text-slate-400 line-through">
                                        {formatVND(product.priceOriginal)}
                                    </span>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-emerald-600">
                                        -{discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Price includes VAT (where applicable). Business invoices are
                            supported.
                        </p>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-3 border-b border-slate-100 pb-3 text-xs text-slate-600">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-24 text-slate-400">Shipping</span>
                            <span>
                                Free shipping for orders over 500.000 ₫ (selected areas).
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-24 text-slate-400">Warranty</span>
                            <span>
                                Official warranty up to 12 months (depending on product).
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="w-24 text-slate-400">Stock</span>
                            <span>
                                {product.stock > 0
                                    ? `In stock: ${product.stock} item(s)`
                                    : "Out of stock temporarily"}
                            </span>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-24 text-slate-400">Quantity</span>
                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                                <button
                                    className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                >
                                    -
                                </button>
                                <span className="w-10 text-center text-sm font-medium">
                                    {quantity}
                                </span>
                                <button
                                    className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                                    onClick={() =>
                                        setQuantity((q) =>
                                            product.stock ? Math.min(product.stock, q + 1) : q + 1
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>
                            {product.stock > 0 && (
                                <span className="text-[11px] text-slate-500">
                                    {product.stock} items available
                                </span>
                            )}
                        </div>
                    </div>

                    {/* CTA buttons – match global tone (black / slate / emerald) */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 rounded-full border border-slate-900 bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Add to cart
                        </Button>
                        <Button
                            onClick={handleBuyNow}
                            className="flex-1 rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                        >
                            Buy now
                        </Button>
                    </div>
                </div>
            </section>

            {/* DETAILS + REVIEWS */}
            <section className="grid gap-6 lg:grid-cols-[2fr_1.3fr]">
                {/* DETAILS */}
                <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                    <h2 className="border-b border-slate-100 pb-3 text-base font-semibold uppercase text-slate-800">
                        Product details
                    </h2>

                    {/* Specs table if available */}
                    {specs.length > 0 && (
                        <div className="mb-4 rounded-md bg-slate-50 p-3 text-xs md:text-sm">
                            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                                {specs.map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex flex-col gap-0.5 border-b border-dashed border-slate-200 pb-1 last:border-none"
                                    >
                                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            {s.label}
                                        </dt>
                                        <dd className="text-slate-700">{s.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Description blocks */}
                    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                        {descriptionBlocks.length > 0 ? (
                            descriptionBlocks.map((p, idx) => <p key={idx}>{p}</p>)
                        ) : (product as any).subtitle ? (
                            <p>{(product as any).subtitle}</p>
                        ) : (
                            <p>
                                This product is suitable for many daily use cases, with a clean
                                design and solid performance.
                            </p>
                        )}
                    </div>
                </Card>

                {/* REVIEWS */}
                <div className="space-y-5">
                    {/* Rating summary */}
                    <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                        <h2 className="border-b border-slate-100 pb-3 text-base font-semibold uppercase text-slate-800">
                            Ratings & reviews
                        </h2>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 sm:w-40 sm:items-start">
                                <div className="text-3xl font-semibold text-slate-900">
                                    {product.rating.toFixed(1)}
                                    <span className="text-base text-slate-400"> / 5</span>
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(product.rating)
                                                ? "fill-amber-400"
                                                : "text-slate-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {localReviews.length} review(s)
                                </div>
                            </div>

                            <div className="flex-1 space-y-1.5 text-xs">
                                {ratingDist.map((r) => (
                                    <div key={r.star} className="flex items-center gap-2">
                                        <span className="w-10 text-right">{r.star}★</span>
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-amber-400"
                                                style={{ width: `${r.percent}%` }}
                                            />
                                        </div>
                                        <span className="w-10 text-right text-[11px] text-slate-500">
                                            {r.percent}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Review list */}
                    <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Customer reviews
                        </h3>
                        {localReviews.length === 0 && (
                            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                                There are no reviews yet. Be the first to review this product!
                            </div>
                        )}
                        <div className="space-y-3 text-sm">
                            {localReviews.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex gap-3 border-b border-slate-100 pb-3 last:border-none"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                        {r.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-900">
                                                {r.name}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {r.createdAt}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 text-amber-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < r.rating
                                                        ? "fill-amber-400"
                                                        : "text-slate-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-700">
                                            {r.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Review form */}
                    <Card className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Write a review
                        </h3>

                        <div className="grid gap-3 text-sm">
                            <input
                                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                                placeholder="Your name"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                            />

                            <select
                                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                            >
                                <option value={5}>5 stars – Very satisfied</option>
                                <option value={4}>4 stars – Satisfied</option>
                                <option value={3}>3 stars – Acceptable</option>
                                <option value={2}>2 stars – Not good</option>
                                <option value={1}>1 star – Very bad</option>
                            </select>

                            <textarea
                                rows={4}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                                placeholder="Share your experience about quality, delivery time, service..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />

                            {reviewError && (
                                <p className="text-xs text-rose-600">{reviewError}</p>
                            )}

                            <Button
                                className="mt-1 w-full rounded-full bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
                                onClick={submitReview}
                            >
                                Submit review
                            </Button>

                            <p className="text-[11px] text-slate-400">
                                By submitting a review, you agree that your content may be shown
                                publicly. Inappropriate content may be hidden without notice.
                            </p>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
