"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  login: (payload: { name: string; email: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: ({ name, email }) =>
        set({
          user: {
            id: Date.now().toString(),
            name,
            email,
          },
        }),

      logout: () => set({ user: null }),
    }),
    {
      name: "ecom-auth", // lưu ở localStorage
    }
  )
);
