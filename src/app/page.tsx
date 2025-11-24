"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";
import { ProductCard } from "@/features/products/components/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useMemo, useState, useCallback, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useInfiniteScroll } from "@/components/hooks/useInfiniteScroll";

type PriceRange = "all" | "under-5" | "5-15" | "15-30" | "over-30";
type RatingFilter = "all" | "4" | "4.5";

const PAGE_SIZE = 15;

function filterByPrice(products: Product[], range: PriceRange) {
  if (range === "all") return products;
  if (range === "under-5") return products.filter((p) => p.price < 5_000_000);
  if (range === "5-15")
    return products.filter(
      (p) => p.price >= 5_000_000 && p.price <= 15_000_000
    );
  if (range === "15-30")
    return products.filter(
      (p) => p.price > 15_000_000 && p.price <= 30_000_000
    );
  if (range === "over-30") return products.filter((p) => p.price > 30_000_000);
  return products;
}

function filterByRating(products: Product[], rating: RatingFilter) {
  if (rating === "all") return products;
  const min = rating === "4" ? 4 : 4.5;
  return products.filter((p) => p.rating >= min);
}

export default function HomePage() {
  const { data, isLoading } = useProducts();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "popular" | "hot" | "new" | "price-asc" | "price-desc"
  >("popular");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) setShowScrollTop(true);
      else setShowScrollTop(false);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];

    let list = data;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    list = filterByPrice(list, priceRange);
    list = filterByRating(list, ratingFilter);

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "new")
      list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else if (sort === "hot")
      list = [...list].sort((a, b) => Number(b.isHot) - Number(a.isHot));

    return list;
  }, [data, search, category, priceRange, ratingFilter, sort]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(0, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => (prev < maxPage ? prev + 1 : prev));
  }, [maxPage]);

  const sentinelRef = useInfiniteScroll({
    enabled: page < maxPage && !isLoading,
    onLoadMore: handleLoadMore,
  });

  const sortButtonClass = (value: typeof sort) =>
    [
      "rounded-sm px-3 py-1 text-xs sm:text-sm border transition-colors cursor-pointer",
      sort === value
        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-50",
    ].join(" ");

  const priceChipClass = (value: PriceRange) =>
    [
      "w-full rounded-sm border px-2 py-1 text-xs text-left transition-colors cursor-pointer",
      priceRange === value
        ? "border-slate-900 text-slate-900 bg-slate-100 dark:border-slate-100 dark:text-slate-900 dark:bg-slate-100"
        : "border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-50",
    ].join(" ");

  const ratingChipClass = (value: RatingFilter) =>
    [
      "inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs transition-colors cursor-pointer",
      ratingFilter === value
        ? "border-slate-900 text-slate-900 bg-slate-100 dark:border-slate-100 dark:text-slate-900 dark:bg-slate-100"
        : "border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-50",
    ].join(" ");

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
              <span className="cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">
                Home
              </span>
              <span className="mx-1">/</span>
              <span className="text-slate-900 font-medium dark:text-slate-50">
                Shop
              </span>
            </div>
            <h1 className="text-base font-semibold tracking-tight sm:text-lg text-slate-900 dark:text-slate-50">
              Recommended products for you
            </h1>
          </div>

          <div className="w-full max-w-md">
            <Input
              placeholder="Search products, brands..."
              className="h-9 rounded-sm border-slate-200 bg-white text-xs sm:h-10 sm:text-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 sm:hidden dark:text-slate-400">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Filters</span>
          </div>
          <span>{filtered.length} products</span>
        </div>

        <div className="flex gap-2 sm:gap-3 lg:gap-4">
          <aside className="hidden w-[210px] shrink-0 lg:block">
            <div className="rounded-sm bg-white p-3 text-xs shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
              <div className="border-b border-slate-100 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-800 dark:text-slate-200">
                Filters
              </div>

              <div className="mt-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="mb-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Categories
                </div>
                <button
                  onClick={() => {
                    setCategory("all");
                    resetPage();
                  }}
                  className={`mb-1 flex w-full items-center justify-between rounded-sm px-1 py-1 text-left text-xs cursor-pointer ${
                    category === "all"
                      ? "text-slate-900 font-semibold dark:text-slate-50"
                      : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
                  }`}
                >
                  <span>All</span>
                </button>
                <div className="space-y-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        resetPage();
                      }}
                      className={`flex w-full items-center justify-between rounded-sm px-1 py-1 text-left text-xs ${
                        category === cat
                          ? "text-slate-900 font-semibold dark:text-slate-50"
                          : "text-slate-700 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:text-slate-50"
                      }`}
                    >
                      <span className="line-clamp-1">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="mb-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Price range
                </div>
                <div className="space-y-1">
                  <button
                    className={priceChipClass("all")}
                    onClick={() => {
                      setPriceRange("all");
                      resetPage();
                    }}
                  >
                    All
                  </button>
                  <button
                    className={priceChipClass("under-5")}
                    onClick={() => {
                      setPriceRange("under-5");
                      resetPage();
                    }}
                  >
                    Under 5M VND
                  </button>
                  <button
                    className={priceChipClass("5-15")}
                    onClick={() => {
                      setPriceRange("5-15");
                      resetPage();
                    }}
                  >
                    5M - 15M VND
                  </button>
                  <button
                    className={priceChipClass("15-30")}
                    onClick={() => {
                      setPriceRange("15-30");
                      resetPage();
                    }}
                  >
                    15M - 30M VND
                  </button>
                  <button
                    className={priceChipClass("over-30")}
                    onClick={() => {
                      setPriceRange("over-30");
                      resetPage();
                    }}
                  >
                    Over 30M VND
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Rating
                </div>
                <div className="space-y-1">
                  <button
                    className={ratingChipClass("all")}
                    onClick={() => {
                      setRatingFilter("all");
                      resetPage();
                    }}
                  >
                    All
                  </button>
                  <button
                    className={ratingChipClass("4")}
                    onClick={() => {
                      setRatingFilter("4");
                      resetPage();
                    }}
                  >
                    From 4.0★
                  </button>
                  <button
                    className={ratingChipClass("4.5")}
                    onClick={() => {
                      setRatingFilter("4.5");
                      resetPage();
                    }}
                  >
                    From 4.5★
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-2 rounded-sm bg-white px-2 py-2 text-xs shadow-sm sm:px-3 sm:py-2.5 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-600 sm:text-xs dark:text-slate-300">
                    Sort by
                  </span>
                  <button
                    className={sortButtonClass("popular")}
                    onClick={() => {
                      setSort("popular");
                      resetPage();
                    }}
                  >
                    Most popular
                  </button>
                  <button
                    className={sortButtonClass("hot")}
                    onClick={() => {
                      setSort("hot");
                      resetPage();
                    }}
                  >
                    Best-selling
                  </button>
                  <button
                    className={sortButtonClass("new")}
                    onClick={() => {
                      setSort("new");
                      resetPage();
                    }}
                  >
                    Newest
                  </button>

                  <div className="flex items-center gap-0.5 rounded-sm border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
                    <button
                      className={`px-2 py-1 text-[11px] sm:text-xs rounded-[2px] cursor-pointer ${
                        sort === "price-asc"
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-50"
                      }`}
                      onClick={() => {
                        setSort("price-asc");
                        resetPage();
                      }}
                    >
                      Price: low to high
                    </button>
                    <button
                      className={`px-2 py-1 text-[11px] sm:text-xs rounded-[2px] cursor-pointer ${
                        sort === "price-desc"
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-50"
                      }`}
                      onClick={() => {
                        setSort("price-desc");
                        resetPage();
                      }}
                    >
                      Price: high to low
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <div className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {visible.length}
                    </span>{" "}
                    of {filtered.length} products
                  </div>

                  <div className="sm:hidden">
                    <Select
                      value={sort}
                      onValueChange={(v) => {
                        setSort(v as typeof sort);
                        resetPage();
                      }}
                    >
                      <SelectTrigger className="h-8 w-40 rounded-sm border-slate-200 bg-white text-[11px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                        {sort === "popular" && "Most popular"}
                        {sort === "hot" && "Best-selling"}
                        {sort === "new" && "Newest"}
                        {sort === "price-asc" && "Price: low to high"}
                        {sort === "price-desc" && "Price: high to low"}
                      </SelectTrigger>
                      <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <SelectItem value="popular">Most popular</SelectItem>
                        <SelectItem value="hot">Best-selling</SelectItem>
                        <SelectItem value="new">Newest</SelectItem>
                        <SelectItem value="price-asc">
                          Price: low to high
                        </SelectItem>
                        <SelectItem value="price-desc">
                          Price: high to low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 flex flex-wrap gap-2 pb-1 text-[11px] lg:hidden">
              <button
                onClick={() => {
                  setCategory("all");
                  resetPage();
                }}
                className={`whitespace-nowrap rounded-full border px-3 py-1 ${
                  category === "all"
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    resetPage();
                  }}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 ${
                    category === cat
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="rounded-sm py-2 dark:border-slate-800">
              {isLoading ? (
                <div className="py-10 text-center text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  Loading products...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-5">
                    {visible.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>

                  <div ref={sentinelRef} className="h-8 w-full" />

                  {page < maxPage && (
                    <div className="mt-3 text-center text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
                      Scroll down to load more or{" "}
                      <button
                        className="font-semibold text-slate-900 underline dark:text-slate-50"
                        onClick={handleLoadMore}
                      >
                        click to load more
                      </button>
                    </div>
                  )}

                  <div className="mt-1 text-center text-[11px] text-slate-400 sm:hidden dark:text-slate-500">
                    Page {page}/{maxPage}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="
            fixed bottom-16 right-6 z-50
            flex h-12 w-12 items-center justify-center
            rounded-full shadow-lg transition-all cursor-pointer
            bg-slate-900 text-white hover:bg-slate-700
            dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200
          "
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
