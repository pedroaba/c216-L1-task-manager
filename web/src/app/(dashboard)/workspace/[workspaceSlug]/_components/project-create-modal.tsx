"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
} from "@/constants/validations";
import {
  getGetProjectQueryKey,
  postProject,
} from "@/http/gen/endpoints/project/project.gen";

const schema = z.object({
  name: z.string().min(2).max(MAX_NAME_LENGTH),
  description: z.string().min(2).max(MAX_DESCRIPTION_LENGTH).optional(),
  icon: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function ProjectCreateModal() {
  const { workspaceSlug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Folder",
    },
  });

  async function handleCreateProject({ name, description, icon }: Schema) {
    if (!workspaceSlug) {
      return;
    }

    const toastId = toast.loading("Creating project...");
    const [responseError] = await postProject({
      name,
      description,
      icon,
      workspaceId: String(workspaceSlug),
    });

    if (responseError) {
      toast.error("Failed to create project", { id: toastId });
      return;
    }

    toast.success("Project created!", { id: toastId });
    form.reset({
      name: "",
      description: "",
      icon: "Folder",
    });

    await queryClient.invalidateQueries({
      queryKey: getGetProjectQueryKey(),
    });

    setIsModalOpen(false);
  }

  return (
    <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm" size="sm">
          <Plus className="size-4" />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Give your project a name and description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            id="project-create-form"
            onSubmit={form.handleSubmit(handleCreateProject)}
          >
            <div className="flex items-center justify-between gap-2.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Enter a name for your project"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="icon">Icon</FormLabel>
                    <FormControl>
                      <IconPicker
                        onValueChange={field.onChange}
                        // @ts-expect-error
                        value={field.value?.toLowerCase()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32"
                      placeholder="Enter a description for your project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <CardFooter className="flex w-full items-center justify-end gap-4 p-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="project-create-form"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Create Project
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
