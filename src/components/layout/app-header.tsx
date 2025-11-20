"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppHeader() {
    const pathname = usePathname();
    const cartCount = useCartStore((s) => s.totalItems?.() ?? s.items.length);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    const avatarLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U";

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
            <div className="container-app flex h-16 items-center justify-between gap-4">
                {/* Left: Logo + nav */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                    >
                        <span className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-2.5 py-1 text-sm text-white shadow-sm">
                            My
                        </span>
                        <span className="hidden text-slate-900 sm:inline">Store</span>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden items-center gap-2 text-xs md:flex">
                        <NavItem href="/" active={isActive("/")}>
                            Home
                        </NavItem>
                        <NavItem href="/cart" active={isActive("/cart")}>
                            Cart
                        </NavItem>
                        <NavItem href="/checkout" active={isActive("/checkout")}>
                            Checkout
                        </NavItem>
                    </nav>
                </div>

                {/* Right: Cart + User */}
                <div className="flex items-center gap-3">
                    {/* Cart */}
                    <Link
                        href="/cart"
                        id="app-cart-icon"
                        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {cartCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth */}
                    {!user ? (
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="hidden rounded-full border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-900 hover:text-white sm:inline-flex"
                        >
                            <Link href="/login">Login</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm">
                                    {avatarLetter}
                                </div>
                                <div className="hidden flex-col leading-tight sm:flex">
                                    <span className="max-w-[140px] truncate text-xs font-semibold text-slate-900">
                                        {user.name}
                                    </span>
                                    <span className="max-w-[160px] truncate text-[11px] text-slate-500">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="hidden text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
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
                "group inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                active &&
                "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white"
            )}
        >
            <span>{children}</span>
            {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.25)]" />
            )}
        </Link>
    );
}
