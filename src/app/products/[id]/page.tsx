"use client";

import { useCartStore } from "@/features/cart/store";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";

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
  const base = [0, 0, 0, 0, 0];

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

  const [localReviews, setLocalReviews] = useState<LocalReview[]>(MOCK_REVIEWS);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImgRef = useRef<HTMLImageElement | null>(null);

  const product = useMemo(
    () => data?.find((p) => p.id === params.id),
    [data, params.id]
  );

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const imgs = product.images;
    if (imgs && imgs.length > 0) return imgs;
    return [product.thumbnail];
  }, [product]);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading product information...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4 py-16">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
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
  const activeImage = gallery[activeIndex] ?? gallery[0];

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

  const descriptionBlocks: string[] = (() => {
    const desc: unknown = product.description;

    if (!desc) return [];

    if (Array.isArray(desc)) {
      return desc.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof desc === "string") {
      return desc
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  })();

  const specs: { label: string; value: string }[] =
    (product.specs as { label: string; value: string }[]) ?? [];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="space-y-10">
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <span>/</span>
          <span
            className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => router.push("/")}
          >
            Products
          </span>
          <span>/</span>
          <span className="line-clamp-1 font-medium text-slate-900 dark:text-slate-50">
            {product.name}
          </span>
        </div>

        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6 lg:grid-cols-[1.05fr_1.6fr] dark:border-slate-700 dark:bg-slate-900">
          <div className="flex gap-4">
            <div className="hidden w-20 shrink-0 flex-col gap-2 sm:flex max-h-[400px] overflow-y-auto pr-1">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative cursor-pointer overflow-hidden rounded-md border bg-slate-50 transition hover:border-slate-900 dark:bg-slate-800 ${
                    i === activeIndex
                      ? "border-slate-900 ring-2 ring-slate-200 dark:ring-slate-700"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="relative aspect-square w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} - ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-contain p-1.5"
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-1 items-start justify-center">
              <div className="relative aspect-square w-full max-w-[480px] overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={mainImgRef}
                  src={activeImage}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-contain p-6"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {product.brand} • {product.category}
              </p>
              <h1 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg md:text-xl dark:text-slate-50">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  {product.subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-3 text-xs dark:border-slate-700">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="font-semibold">
                    {product.rating.toFixed(1)}
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ({localReviews.length} reviews)
              </span>
              <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Sold:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {Math.max(localReviews.length * 3, 10)}
                </span>
              </span>
              {product.isNew && (
                <>
                  <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
                  <span className="rounded-sm bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                    New arrival
                  </span>
                </>
              )}
              {product.isHot && (
                <span className="rounded-sm bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                  Best seller
                </span>
              )}
            </div>

            <div className="rounded-md bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900/60">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                  {formatVND(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xs text-slate-400 line-through dark:text-slate-500">
                      {formatVND(product.priceOriginal)}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Price includes VAT (where applicable). Business invoices are
                supported.
              </p>
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-slate-400 dark:text-slate-500">
                  Shipping
                </span>
                <span>
                  Free shipping for orders over 500.000 ₫ (selected areas).
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-slate-400 dark:text-slate-500">
                  Warranty
                </span>
                <span>
                  Official warranty up to 12 months (depending on product).
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-slate-400 dark:text-slate-500">
                  Stock
                </span>
                <span>
                  {product.stock > 0
                    ? `In stock: ${product.stock} item(s)`
                    : "Out of stock temporarily"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-24 text-slate-400 dark:text-slate-500">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <button
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-l-full text-slate-700 transition-all duration-150 hover:bg-slate-100 active:scale-90 dark:text-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>

                  <span className="w-12 select-none text-center text-sm font-medium text-slate-900 dark:text-slate-50">
                    {quantity}
                  </span>

                  <button
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-r-full text-slate-700 transition-all duration-150 hover:bg-slate-100 active:scale-90 dark:text-slate-100 dark:hover:bg-slate-800"
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
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {product.stock} items available
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                className="
                flex-1 rounded-full
                border border-slate-900
                bg-slate-900 text-white
                hover:bg-slate-800

                dark:border-slate-100
                dark:bg-slate-100 dark:text-slate-900
                dark:hover:bg-slate-200
            "
              >
                Add to cart
              </Button>

              <Button
                onClick={handleBuyNow}
                className="flex-1 rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-900 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800"
              >
                Buy now
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1.3fr]">
          <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="border-b border-slate-100 pb-3 text-base font-semibold uppercase text-slate-800 dark:border-slate-700 dark:text-slate-100">
              Product details
            </h2>

            {specs.length > 0 && (
              <div className="mb-4 rounded-md bg-slate-50 p-3 text-xs md:text-sm dark:bg-slate-900/60">
                <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col gap-0.5 border-b border-dashed border-slate-200 pb-1 last:border-none dark:border-slate-700"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {s.label}
                      </dt>
                      <dd className="text-slate-700 dark:text-slate-200">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {descriptionBlocks.length > 0 ? (
                descriptionBlocks.map((p, idx) => <p key={idx}>{p}</p>)
              ) : product.subtitle ? (
                <p>{product.subtitle}</p>
              ) : (
                <p>
                  This product is suitable for many daily use cases, with a
                  clean design and solid performance.
                </p>
              )}
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="border-b border-slate-100 pb-3 text-base font-semibold uppercase text-slate-800 dark:border-slate-700 dark:text-slate-100">
                Ratings & reviews
              </h2>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 sm:w-40 sm:items-start dark:border-slate-700">
                  <div className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                    {product.rating.toFixed(1)}
                    <span className="text-base text-slate-400 dark:text-slate-500">
                      {" "}
                      / 5
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating)
                            ? "fill-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {localReviews.length} review(s)
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-xs">
                  {ratingDist.map((r) => (
                    <div key={r.star} className="flex items-center gap-2">
                      <span className="w-10 text-right text-slate-600 dark:text-slate-300">
                        {r.star}★
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[11px] text-slate-500 dark:text-slate-400">
                        {r.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Customer reviews
              </h3>
              {localReviews.length === 0 && (
                <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  There are no reviews yet. Be the first to review this product!
                </div>
              )}
              <div className="space-y-3 text-sm">
                {localReviews.map((r) => (
                  <div
                    key={r.id}
                    className="flex gap-3 border-b border-slate-100 pb-3 last:border-none dark:border-slate-700"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {r.name}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {r.createdAt}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating
                                ? "fill-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                        {r.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Write a review
              </h3>

              <div className="grid gap-3 text-sm">
                <input
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                  placeholder="Your name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                />

                <select
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-600"
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
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                  placeholder="Share your experience about quality, delivery time, service..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                {reviewError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    {reviewError}
                  </p>
                )}

                <Button
                  className="mt-1 w-full rounded-full bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
                  onClick={submitReview}
                >
                  Submit review
                </Button>

                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  By submitting a review, you agree that your content may be
                  shown publicly. Inappropriate content may be hidden without
                  notice.
                </p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
