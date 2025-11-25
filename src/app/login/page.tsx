"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Lock, MonitorSmartphone } from "lucide-react";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    login({ name: values.name, email: values.email });
    router.push("/");
  };

  if (user) {
    return (
      <div className="px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 via-sky-400 to-indigo-500 text-lg font-bold text-slate-950 shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                You are already logged in
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can return to the homepage and continue shopping.
              </p>
            </div>
          </div>

          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Account information
              </p>
              <p>
                Name:{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {user.name}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-mono text-slate-700 dark:text-slate-200">
                  {user.email}
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              <p className="mb-1 font-semibold text-slate-800 dark:text-slate-100">
                Quick tip
              </p>
              <p>
                This is only a demo login flow. Later, you can replace it with
                OAuth (Google, Zalo, etc.) or a real backend without changing
                the UI.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full rounded-full border-slate-300 text-sm font-medium dark:border-slate-600 sm:w-auto"
              onClick={() => router.push("/cart")}
            >
              View cart
            </Button>
            <Button
              className="w-full rounded-full bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
              onClick={() => router.push("/")}
            >
              Back to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:items-stretch">
        <div className="relative hidden flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 px-6 py-6 text-slate-50 shadow-2xl md:flex lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
          </div>

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-100 ring-1 ring-slate-700/70">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>MyStore • Demo E-commerce</span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
              Log in to experience{" "}
              <span className="bg-linear-to-r from-emerald-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                modern shopping
              </span>
            </h1>

            <p className="max-w-xl text-sm text-slate-300">
              Save your cart, check out faster, and sync your experience across
              devices. This is a demo flow — just enter your name &amp; email to
              continue.
            </p>

            <div className="mt-4 grid gap-3 text-xs text-slate-200 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-2xl bg-slate-900/70 p-3 ring-1 ring-slate-800">
                <div className="mt-0.5 rounded-full bg-emerald-500/15 p-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Secure checkout</p>
                  <p className="text-[11px] text-slate-300">
                    Simulated payment flow (e.g., ZaloPay). Later you can plug
                    in real payment gateways.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-slate-900/70 p-3 ring-1 ring-slate-800">
                <div className="mt-0.5 rounded-full bg-sky-500/15 p-1.5">
                  <MonitorSmartphone className="h-3.5 w-3.5 text-sky-300" />
                </div>
                <div>
                  <p className="font-semibold">Responsive UI</p>
                  <p className="text-[11px] text-slate-300">
                    Optimized for desktop and mobile with automatic dark mode
                    support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Demo project • Next.js + React Query + Zustand</span>
            </div>
            <span className="hidden h-px flex-1 bg-slate-700 sm:block" />
          </div>
        </div>

        <div className="flex w-full max-w-md flex-1 items-center">
          <Card className="w-full rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:p-8">
            <div className="mb-6 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Demo login</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Welcome back 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter any name and email to simulate login. Later you can
                replace this with OAuth or a real backend.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Full name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600"
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
                      <FormLabel className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="mt-1 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Log in
                </Button>

                <p className="mt-2 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                  This is a demo system with no real third-party integrations.
                  You can freely test the login flow without worrying about real
                  data.
                </p>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
