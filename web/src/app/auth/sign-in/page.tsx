import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { SignInForm } from "./_components/form";

export default async function SignInPage() {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="mb-4 flex flex-col items-center gap-2">
        <GalleryVerticalEnd className="size-6" />
        <div className="text-center">
          <h1 className="font-bold text-2xl">Taskerra</h1>
          <p className="max-w-md text-muted-foreground text-sm">
            Organize, prioritize, and accomplish your goals with our intuitive
            task management platform
          </p>
        </div>
      </div>

      <SignInForm />

      <p className="text-muted-foreground text-sm">
        Don't have an account?{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/auth/sign-up"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
