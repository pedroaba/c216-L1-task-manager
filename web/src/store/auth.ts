import { create } from "zustand";
import type { User } from "@/types/user";

type AuthStoreState = {
  user: User | null;
  isLoadingUserProfile: boolean;
  hasAttemptedLoad: boolean;
  setUser: (user: User) => void;
  setIsLoadingUserProfile: (isLoadingUserProfile: boolean) => void;
  setHasAttemptedLoad: (hasAttemptedLoad: boolean) => void;
  reset: () => void;
};

const initialState = {
  user: null,
  isLoadingUserProfile: true,
  hasAttemptedLoad: false,
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...initialState,
  setIsLoadingUserProfile: (isLoadingUserProfile: boolean) =>
    set({ isLoadingUserProfile }),
  setUser: (user: User) => set({ user, hasAttemptedLoad: true }),
  setHasAttemptedLoad: (hasAttemptedLoad: boolean) => set({ hasAttemptedLoad }),
  reset: () => set(initialState),
}));
