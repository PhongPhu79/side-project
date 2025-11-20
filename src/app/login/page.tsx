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

const loginSchema = z.object({
    name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    // password: z.string().min(4, "Mật khẩu ít nhất 4 ký tự"), // có thể thêm nếu muốn
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
        router.push("/"); // sau đăng nhập quay về home
    };

    // Nếu đã đăng nhập rồi, hiển thị thông tin + nút quay lại
    if (user) {
        return (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
                <h1 className="mb-2 text-xl font-semibold">Bạn đã đăng nhập</h1>
                <p className="mb-1">
                    Tên: <span className="font-semibold">{user.name}</span>
                </p>
                <p className="mb-4">
                    Email: <span className="font-mono text-slate-600">{user.email}</span>
                </p>
                <Button className="w-full" onClick={() => router.push("/")}>
                    Về trang chủ
                </Button>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="mb-2 text-xl font-semibold">Đăng nhập</h1>
                <p className="mb-6 text-sm text-slate-500">
                    Nhập thông tin demo để đăng nhập. Sau này có thể thay bằng luồng
                    Zalo / OAuth / backend thật.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ & tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyễn Văn A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nếu muốn password demo:
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

                        <Button type="submit" className="mt-2 w-full">
                            Đăng nhập
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
