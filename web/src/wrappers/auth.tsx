"use client";

import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { LoadProfile } from "@/components/load-profile";
import { appConfig } from "@/constants/app-config";
import { getProfile } from "@/http/get-profile";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/user";

const TOAST_DELAY = 1500;

type AuthWrapperProps = {
  children: ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoadingUserProfile, hasAttemptedLoad } = useAuthStore();
  const { setUser, setIsLoadingUserProfile, setHasAttemptedLoad, reset } =
    useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (hasAttemptedLoad || user) {
      return;
    }

    setIsLoadingUserProfile(true);
    getProfile()
      .then((response) => {
        if (!response.success) {
          setHasAttemptedLoad(true);
          const toastId = toast.error(response.message);

          setTimeout(() => {
            toast.info("Redirecting to sign in page...", { id: toastId });
            destroyCookie(null, appConfig.authCookieName);
            reset();

            router.push("/auth/sign-in");
          }, TOAST_DELAY);
          return;
        }

        setUser(response.other as User);
      })
      .catch(() => {
        setHasAttemptedLoad(true);
        toast.error("Failed to load profile");

        destroyCookie(null, appConfig.authCookieName);
        reset();
        router.push("/auth/sign-in");
      })
      .finally(() => {
        setIsLoadingUserProfile(false);
      });
  }, [
    hasAttemptedLoad,
    user,
    setIsLoadingUserProfile,
    setUser,
    setHasAttemptedLoad,
    router,
    reset,
  ]);

  if (isLoadingUserProfile) {
    return <LoadProfile />;
  }

  return <>{children}</>;
}
