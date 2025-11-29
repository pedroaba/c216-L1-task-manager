"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useGetProjectIdOrSlug } from "@/http/gen/endpoints/project/project.gen";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/http/create-task";
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from "@/constants/validations";

const schema = z.object({
  title: z.string().min(5).max(MAX_NAME_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "in-review", "done"]),
  dueDate: z.string().optional(),
  labels: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

type TaskCreateModalProps = {
  trigger?: ReactNode;
  triggerAsChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialStatus?: "todo" | "in-progress" | "in-review" | "done";
};

export function TaskCreateModal({
  trigger,
  triggerAsChild = true,
  open,
  onOpenChange,
  initialStatus,
}: TaskCreateModalProps = {}) {
  const { projectSlug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Get project to get the project ID
  const { data: projectResponse } = useGetProjectIdOrSlug(String(projectSlug));
  // httpClient returns [error, data] format - same pattern as useGetProject
  const [_, projectData] = projectResponse ?? [];
  const projectId = projectData?.project?.id || null;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: initialStatus || "todo",
      dueDate: "",
      labels: "",
    },
  });

  // Update form when initialStatus changes
  useEffect(() => {
    if (initialStatus) {
      form.setValue("status", initialStatus);
    }
  }, [initialStatus, form]);

  // Use controlled state if provided, otherwise use internal state
  const modalOpen = open !== undefined ? open : isModalOpen;
  const setModalOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setIsModalOpen(value);
    }
  };

  async function handleCreateTask({
    title,
    description,
    priority,
    status,
    dueDate,
    labels,
  }: Schema) {
    if (!projectId) {
      toast.error("Project not found");
      return;
    }

    const toastId = toast.loading("Creating task...");
    
    // Convert date from YYYY-MM-DD to ISO datetime format (YYYY-MM-DDTHH:mm:ssZ)
    // Simply append time at midnight UTC to preserve the date exactly as selected
    let formattedDueDate: string | undefined = undefined;
    if (dueDate && dueDate.trim() !== "") {
      // Use the date as-is and append midnight UTC time
      formattedDueDate = `${dueDate}T00:00:00.000Z`;
    }
    
    const response = await createTask({
      title,
      description,
      projectId,
      priority,
      status,
      dueDate: formattedDueDate,
      labels: labels
        ? labels.split(",").map((label) => label.trim()).filter(Boolean)
        : [],
    });

    if (!response.success) {
      toast.error(response.message || "Failed to create task", { id: toastId });
      return;
    }

    toast.success(response.message || "Task created!", { id: toastId });
    form.reset({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
      labels: "",
    });

    // Invalidate and refetch tasks queries
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
    
    // Force refetch to ensure the list is updated immediately
    queryClient.refetchQueries({
      queryKey: ["tasks"],
    });

    setModalOpen(false);
  }

  return (
    <Dialog
      onOpenChange={(state) => {
        if (!state) {
          form.reset({
            title: "",
            description: "",
            priority: "medium",
            status: initialStatus || "todo",
            dueDate: "",
            labels: "",
          });
        }
        setModalOpen(state);
      }}
      open={modalOpen}
    >
      {trigger && (
        <DialogTrigger asChild={triggerAsChild}>{trigger}</DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>
            Add a new task to your project board.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            id="task-create-form"
            onSubmit={form.handleSubmit(handleCreateTask)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
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
                      placeholder="Enter task description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel htmlFor="priority">Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="labels">Labels</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Comma-separated labels (e.g., frontend, bug)"
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
            form="task-create-form"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Create Task
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

