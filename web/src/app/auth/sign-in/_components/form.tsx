"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/http/sign-in";

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  async function handleSignIn({
    email,
    password,
  }: z.infer<typeof signInSchema>) {
    const toastId = toast.loading("Signing in...");
    const response = await signIn({
      email,
      password,
    });

    if (response.success) {
      toast.error(response.message, { id: toastId });
      return;
    }

    toast.success(response.message, {
      description: "You will be redirected to the home page",
      id: toastId,
    });
    router.push("/");
  }

  return (
    <Form {...form}>
      <form id="sign-in-form" onSubmit={form.handleSubmit(handleSignIn)}>
        <FieldGroup className="gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-full autofill:bg-input"
                    placeholder="m@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    className="w-full autofill:bg-input"
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className=""
            form="sign-in-form"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Sign in
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}
