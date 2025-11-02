"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useImperativeHandle, useState } from "react";
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
  putProjectIdOrSlug,
} from "@/http/gen/endpoints/project/project.gen";

const schema = z.object({
  name: z.string().min(5).max(MAX_NAME_LENGTH),
  description: z.string().min(2).max(MAX_DESCRIPTION_LENGTH).optional(),
  icon: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export type ProjectEditModalMethod = {
  open: (project: {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
  }) => void;
  close: () => void;
};

type ProjectEditModalProps = {
  ref: React.RefObject<ProjectEditModalMethod | null>;
};

export function ProjectEditModal({ ref }: ProjectEditModalProps) {
  const { workspaceSlug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState<{
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Folder",
    },
  });

  useImperativeHandle(ref, () => ({
    open: (project) => {
      form.reset(project);
      setIsModalOpen(true);
      setProject(project);
    },
    close: () => setIsModalOpen(false),
  }));

  async function handleEditProject({ name, description, icon }: Schema) {
    if (!(workspaceSlug && project)) {
      return;
    }

    const toastId = toast.loading("Updating project...");
    const [responseError] = await putProjectIdOrSlug(project.id, {
      name,
      description,
      icon,
    });

    if (responseError) {
      toast.error("Failed to update project", { id: toastId });
      return;
    }

    toast.success("Project updated!", { id: toastId });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Change project name, icon and description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            id="project-create-form"
            onSubmit={form.handleSubmit(handleEditProject)}
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
            Update Project
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
