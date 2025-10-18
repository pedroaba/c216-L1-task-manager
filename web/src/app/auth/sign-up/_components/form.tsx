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
import { signUp } from "@/http/sign-up";

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signUpSchema = z
  .object({
    name: z
      .string({
        error: "Name is required",
      })
      .min(1, {
        message: "Name is required",
      }),
    email: z.email({
      error: "Invalid email address",
    }),
    password: z
      .string({
        error: "Password is required",
      })
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string({
      error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Schema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();

  async function handleSignUp(data: Schema) {
    const toastId = toast.loading("Signing up...");
    const response = await signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!response.success) {
      toast.error(response.message, { id: toastId });
      return;
    }

    toast.success(response.message, {
      description: "You will be redirected to the sign in page",
      id: toastId,
    });
    router.push("/auth/sign-in");
  }

  return (
    <Form {...form}>
      <form id="sign-up-form" onSubmit={form.handleSubmit(handleSignUp)}>
        <FieldGroup className="gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full autofill:bg-input"
                    placeholder="John Doe"
                    {...field}
                  />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full autofill:bg-input"
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            form="sign-up-form"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Sign up
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}
