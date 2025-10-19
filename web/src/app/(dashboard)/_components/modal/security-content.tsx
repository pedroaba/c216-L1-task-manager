"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const changePasswordSchema = z
  .object({
    currentPassword: z.string({
      error: "Current password is required",
    }),
    newPassword: z
      .string({
        error: "New password is required",
      })
      .min(MIN_PASSWORD_LENGTH, {
        message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string({
      error: "Confirm password is required",
    }),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export function SecurityContent() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="space-y-1">
        <h3 className="font-semibold text-2xl tracking-tight">
          Security Settings
        </h3>
        <p className="text-base text-muted-foreground">
          Manage your password and account security
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Change Password */}
        <Card>
          <CardContent>
            <CardHeader className="grid-cols-[auto_1fr] p-0">
              <div className="rounded-lg bg-primary/10 p-3">
                <Lock className="size-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </div>
            </CardHeader>

            <Form {...form}>
              <form className="space-y-5 pt-2">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          placeholder="************"
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          placeholder="************"
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          className="text-base"
                          placeholder="************"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Verification */}
        <Card>
          <CardContent>
            <CardHeader className="grid-cols-[auto_1fr_auto] place-content-center p-0">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle>Account Verification</CardTitle>
                <CardDescription>
                  Verify your account to ensure your security
                </CardDescription>
              </div>
              <Badge className="bg-green-500/10 px-3 text-green-700 text-sm hover:bg-green-500/20">
                Verified
              </Badge>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
