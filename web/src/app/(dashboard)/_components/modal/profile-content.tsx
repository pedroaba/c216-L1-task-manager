"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/http/update-profile";
import type { User as UserType } from "@/types/user";

const schema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.email({
    message: "Invalid email address",
  }),
});

type Schema = z.infer<typeof schema>;

type ProfileContentProps = {
  user: UserType;
  updateProfileStored: (data: Schema) => void;
};

export function ProfileContent({
  user,
  updateProfileStored,
}: ProfileContentProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  function formatDate(dateString: string): string {
    if (!dateString) {
      return "Data não disponível";
    }

    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return "Data não disponível";
      }
      return date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Data não disponível";
    }
  }

  async function handleUpdateProfile(data: Schema) {
    const response = await updateProfile({
      userId: user.id,
      email: data.email,
      name: data.name,
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    updateProfileStored({
      name: data.name,
      email: data.email,
    });
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="space-y-1">
        <h3 className="font-semibold text-2xl tracking-tight">
          Personal Information
        </h3>
        <p className="text-base text-muted-foreground">
          Update your personal details and information
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          id="profile-form"
          onSubmit={form.handleSubmit(handleUpdateProfile)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-medium text-base">
                  <User className="size-4 text-muted-foreground" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input className="text-base" {...field} />
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
                <FormLabel className="flex items-center gap-2 font-medium text-base">
                  <Mail className="size-4 text-muted-foreground" />
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input className="text-base" type="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Separator className="" />

      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-primary/10 p-2.5">
            <Calendar className="size-full text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base">Member Since</p>
            <p className="text-muted-foreground text-sm">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button className="text-base" variant="outline">
          Cancel
        </Button>
        <Button
          className="text-base"
          form="profile-form"
          isLoading={form.formState.isSubmitting}
          type="submit"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
