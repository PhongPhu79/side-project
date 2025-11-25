"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headset, Menu, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totalItems?.() ?? s.items.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]",
          "dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_10px_40px_rgba(15,23,42,0.8)]"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-24",
            "bg-linear-to-b from-slate-900/5 via-slate-900/0 to-transparent",
            "dark:from-slate-900/40 dark:via-slate-900/10 dark:to-transparent"
          )}
        />

        <div className="container-app relative flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "group flex items-center gap-3 rounded-full px-3 py-1.5 pr-4 shadow-md ring-1 transition",
                "bg-white/90 ring-slate-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg",
                "dark:bg-slate-900/90 dark:ring-slate-700 dark:hover:bg-slate-900 dark:shadow-[0_12px_35px_rgba(15,23,42,0.9)]"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 via-sky-400 to-indigo-500 text-sm font-bold text-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.08)]">
                My
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-900 md:text-base dark:text-slate-50">
                  MyStore
                </span>
                <span className="hidden text-[11px] font-medium text-slate-500 md:inline dark:text-slate-400">
                  Premium Tech &amp; Accessories
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavItem href="/" active={isActive("/")}>
                Home
              </NavItem>
              <NavItem href="/cart" active={isActive("/cart")}>
                Cart
              </NavItem>
              <NavItem href="/checkout" active={isActive("/checkout")}>
                Checkout
              </NavItem>
              <NavItem href="/support" active={isActive("/support")}>
                Support
              </NavItem>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Cart icon */}
            <Link
              href="/cart"
              id="app-cart-icon"
              className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-all",
                "bg-white text-slate-700 shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg",
                "dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
              )}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-white shadow-[0_0_0_1px_rgba(15,23,42,0.2)] dark:shadow-[0_0_0_1px_rgba(15,23,42,0.6)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth desktop (ẩn trên mobile, tất cả đưa vào sidebar) */}
            <div className="hidden items-center gap-1.5 md:gap-2.5 sm:flex">
              {!user ? (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className={cn(
                    "rounded-full border-slate-300 bg-slate-900 text-xs font-medium text-slate-50 shadow-md hover:bg-slate-950 hover:text-white",
                    "dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  )}
                >
                  <Link href="/login">Login</Link>
                </Button>
              ) : (
                <>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-full px-2.5 py-1.5 shadow-md ring-1",
                      "bg-white/90 ring-slate-200",
                      "dark:bg-slate-900/90 dark:ring-slate-700"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-xs font-semibold text-slate-950 shadow-md md:h-9 md:w-9">
                      {avatarLetter}
                    </div>
                    <div className="hidden flex-col leading-tight sm:flex">
                      <span className="max-w-[150px] truncate text-xs font-semibold text-slate-900 md:max-w-[180px] dark:text-slate-50">
                        {user.name}
                      </span>
                      <span className="max-w-[170px] truncate text-[11px] text-slate-500 md:max-w-[200px] dark:text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                      "dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    )}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden transition-all",
                "bg-white text-slate-700 shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg",
                "dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] flex justify-end bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="h-full w-72 max-w-[80%] border-l border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* User / login block */}
            <div className="mb-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-xs font-semibold text-slate-950 shadow-md">
                      {avatarLetter}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {user.name}
                      </span>
                      {user.email && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-xs"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-full py-2 text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login">Login / Register</Link>
                </Button>
              )}
            </div>

            <div className="mb-3 border-t border-slate-100 pt-3 text-[11px] uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
              Navigation
            </div>

            <nav className="space-y-1 text-sm">
              <MobileNavLink
                href="/"
                label="Home"
                active={isActive("/")}
                onClick={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                href="/cart"
                label="Cart"
                active={isActive("/cart")}
                onClick={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                href="/checkout"
                label="Checkout"
                active={isActive("/checkout")}
                onClick={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                href="/support"
                label="Support & contact"
                icon={<Headset className="h-4 w-4" />}
                active={isActive("/support")}
                onClick={() => setIsMenuOpen(false)}
              />
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
        "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
        "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
        active &&
          "bg-slate-900 text-slate-50 shadow-[0_10px_25px_rgba(15,23,42,0.25)] dark:bg-slate-100 dark:text-slate-900 dark:shadow-[0_10px_25px_rgba(15,23,42,0.6)]"
      )}
    >
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
        active
          ? "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
