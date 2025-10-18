import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { SignUpForm } from "./_components/form";

export default async function SignUpPage() {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="mb-4 flex flex-col items-center gap-2">
        <GalleryVerticalEnd className="size-6" />
        <div className="text-center">
          <h1 className="font-bold text-2xl">Taskerra</h1>
          <p className="max-w-md text-muted-foreground text-sm">
            Join thousands of users who are already achieving their goals with
            our powerful task management platform
          </p>
        </div>
      </div>

      <SignUpForm />

      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/auth/sign-up"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
