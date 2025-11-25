"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] text-slate-900 dark:text-slate-50">
      <div className="mx-auto max-w-5xl py-6 sm:py-10">
        <div className="mb-6 space-y-2 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Support Center
          </h1>
          <p className="mx-auto max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Need help with your order, payment, or product? Choose a contact
            channel below or send us a request via the form.
          </p>
        </div>

        <div className="mb-6 grid gap-4 text-sm sm:mb-8 sm:grid-cols-3">
          <Card className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
              <MessageCircle className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold">Live chat</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chat with us via Zalo or Messenger for the fastest response.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="https://zalo.me" target="_blank">
                  Open Zalo
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="https://m.me" target="_blank">
                  Messenger
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
              <Phone className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold">Call us</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Support available from 8:00–21:00 every day.
            </p>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="mt-auto font-semibold"
            >
              <a href="tel:0900000000">Call 0900 000 000</a>
            </Button>
          </Card>

          <Card className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Mail className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold">Email support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send us an email if you need an invoice or detailed assistance.
            </p>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="mt-1 font-semibold"
            >
              <a href="mailto:support@mystore.com">support@mystore.com</a>
            </Button>
          </Card>
        </div>

        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-1 text-base font-semibold sm:text-lg text-slate-900 dark:text-slate-50">
            Submit a support request
          </h2>
          <p className="mb-6 text-xs text-slate-500 sm:text-[13px] dark:text-slate-400">
            Fill in the details below. Our support team will contact you soon.
          </p>

          <form
            className="grid gap-5 text-sm sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo only: not connected to backend yet.");
            }}
          >
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Full name *
              </label>
              <Input
                required
                placeholder="John Doe"
                className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm 
                focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Phone number *
              </label>
              <Input
                required
                placeholder="09xx xxx xxx"
                className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm 
                focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Email (optional)
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm 
                focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Order ID (if any)
              </label>
              <Input
                placeholder="e.g. ORD-ABC123"
                className="h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm 
                focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-slate-600"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                How can we help you? *
              </label>
              <Textarea
                required
                rows={4}
                placeholder="Describe your issue..."
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm 
                focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-slate-600"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button
                className="rounded-full px-7 py-2.5 text-sm font-semibold shadow-md
              bg-slate-900 text-white hover:bg-slate-800
              dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Submit request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
