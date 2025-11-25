"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/cart/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(8, "Invalid phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Please enter your shipping address"),
  paymentMethod: z.enum(["cod", "zalopay"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();

  const total = useCartStore((s) => s.total());
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const user = useAuthStore((s) => s.user);

  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: "",
      email: user?.email || "",
      address: "",
      paymentMethod: "zalopay",
    },
  });

  if (!items.length && status === "idle") {
    return (
      <div className="text-slate-900 dark:text-slate-50">
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center text-sm">
          <h1 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Your cart is empty
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Add some products to your cart before checking out.
          </p>
          <Button
            className="mt-6 rounded-full px-6"
            onClick={() => router.push("/")}
          >
            Back to homepage
          </Button>
        </div>
      </div>
    );
  }

  const generateOrderCode = () => {
    return "ORD-" + crypto.randomUUID().slice(0, 6).toUpperCase();
  };

  async function onSubmit(values: CheckoutValues) {
    setStatus("processing");

    const payload = {
      customer: values,
      total,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    };

    if (values.paymentMethod === "zalopay") {
      const res = await fetch("/api/pay/zalopay", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data?.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
      }
    }

    const code = generateOrderCode();
    setOrderCode(code);
    clear();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Header + stepper (confirmation) */}
          <div className="mb-6 space-y-3 sm:mb-8 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl dark:text-slate-50">
                Order confirmation
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Thank you for your purchase.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-900">
                  1
                </span>
                Cart
              </button>

              <span className="h-px w-6 bg-slate-300 dark:bg-slate-600" />

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 dark:text-slate-900">
                  2
                </span>
                Shipping &amp; Payment
              </button>

              <span className="h-px w-6 bg-slate-300 dark:bg-slate-600" />

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-emerald-700">
                  3
                </span>
                Confirmation
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-50">
              Order placed successfully
            </h2>
            <p className="mb-2">
              Your order code:{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {orderCode}
              </span>
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              This is a demo payment flow. In a real integration, you would
              receive a confirmation webhook from ZaloPay or your payment
              provider.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => router.push("/cart")}
              >
                View cart
              </Button>
              <Button
                className="rounded-full px-6"
                onClick={() => router.push("/")}
              >
                Back to homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-900 dark:text-slate-50">
      <div className="mx-auto max-w-6xl py-6 px-2 sm:py-8">
        {/* Header + stepper (checkout) */}
        <div className="mb-6 space-y-3 sm:mb-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-100 sm:text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure checkout
            </div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl dark:text-slate-50">
              Checkout
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter your shipping information and choose a payment method to
              complete your order.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 dark:text-slate-900">
                1
              </span>
              Cart
            </button>

            <span className="h-px w-6 bg-slate-300 dark:bg-slate-600" />

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-900">
                2
              </span>
              Shipping &amp; Payment
            </span>

            <span className="h-px w-6 bg-slate-300 dark:bg-slate-600" />

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-500 dark:text-slate-700">
                3
              </span>
              Confirmation
            </span>
          </div>
        </div>

        {user && (
          <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-slate-700 dark:border-emerald-700/60 dark:bg-emerald-900/25 dark:text-emerald-50">
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              Checking out as:
            </span>{" "}
            <span className="font-medium">{user.name}</span>
            {user.email && (
              <>
                <span className="mx-1 text-slate-400 dark:text-slate-500">
                  •
                </span>
                <span className="text-slate-600 dark:text-slate-200">
                  {user.email}
                </span>
              </>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Chỉ tách 2 cột trên màn lớn, mobile / tablet sẽ xếp dọc */}
            <div className="grid gap-5 lg:gap-6 lg:grid-cols-[2fr_1.15fr]">
              <div className="space-y-4">
                <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                      Shipping address
                    </h2>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Required fields are marked with *
                    </span>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-700 dark:text-slate-200">
                            Full name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-700 dark:text-slate-200">
                            Email (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-700 dark:text-slate-200">
                              Phone number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="09xx xxx xxx"
                                className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-700 dark:text-slate-200">
                            Shipping address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Street, ward, district, city..."
                              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                    Payment method
                  </h2>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-3 text-sm"
                          >
                            <label
                              htmlFor="pm-zlp"
                              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                            >
                              <RadioGroupItem value="zalopay" id="pm-zlp" />
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                  ZaloPay (demo)
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  You will be redirected to the ZaloPay payment
                                  page.
                                </span>
                              </div>
                            </label>

                            <label
                              htmlFor="pm-cod"
                              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                            >
                              <RadioGroupItem value="cod" id="pm-cod" />
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                  Cash on delivery (COD)
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Pay directly to the delivery staff when you
                                  receive the package.
                                </span>
                              </div>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                    Order summary
                  </h2>

                  <div className="mb-3 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-none dark:border-slate-700"
                      >
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain dark:border-slate-700 dark:bg-slate-800"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="line-clamp-2 text-xs font-medium text-slate-900 dark:text-slate-50">
                            {item.product.name}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            Qty:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="whitespace-nowrap text-xs font-semibold text-slate-900 dark:text-slate-50">
                          {(item.product.price * item.quantity).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          ₫
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Subtotal
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-50">
                        {total.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Shipping fee
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Free
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Discount
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        0 ₫
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Total
                    </span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {total.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "processing"}
                    className="mt-1 w-full rounded-full py-3 text-sm font-semibold"
                  >
                    {status === "processing" ? "Processing..." : "Place order"}
                  </Button>

                  <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
