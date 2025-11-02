"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createWorkspace } from "@/http/create-workspace";
import { getGetWorkspaceQueryKey } from "@/http/gen/endpoints/workspace/workspace.gen";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const MAX_DESCRIPTION_LENGTH = 100;

const schema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
    })
    .optional(),
});

type Schema = z.infer<typeof schema>;

type CreateWorkspaceModalProps = {
  trigger?: ReactNode;
  triggerAsChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CreateWorkspaceModal({
  trigger,
  triggerAsChild = true,
  open,
  onOpenChange,
}: CreateWorkspaceModalProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();

  async function handleCreateWorkspace(data: Schema) {
    const toastId = toast.loading("Creating workspace...");
    const response = await createWorkspace({
      name: data.name,
      description: data.description ?? "",
    });

    if (!response.success) {
      toast.error(response.message, { id: toastId });
      return;
    }

    form.reset({
      name: "",
      description: "",
    });

    await queryClient.invalidateQueries({
      queryKey: getGetWorkspaceQueryKey(),
    });

    toast.success(response.message, {
      description: "You will be redirected to the workspace page",
      id: toastId,
    });

    onOpenChange?.(false);
  }

  return (
    <Dialog
      onOpenChange={(state) => {
        if (!state) {
          form.reset({
            name: "",
            description: "",
          });
        }

        onOpenChange?.(state);
      }}
      open={open}
    >
      {trigger && (
        <DialogTrigger asChild={triggerAsChild}>{trigger}</DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to manage your projects and tasks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            id="create-workspace-form"
            onSubmit={form.handleSubmit(handleCreateWorkspace)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for your workspace"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      placeholder="Enter a description for your workspace"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            form="create-workspace-form"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
