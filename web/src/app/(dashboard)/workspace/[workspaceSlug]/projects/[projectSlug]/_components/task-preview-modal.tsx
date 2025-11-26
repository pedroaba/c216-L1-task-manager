"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  List,
  MessageSquare,
  Paperclip,
  Share2,
  Star,
  Trash2,
  User,
} from "lucide-react";
import React, { useImperativeHandle, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteTask } from "@/http/delete-task";
import { updateTask } from "@/http/update-task";
import type { Task } from "@/components/kanban/task-card";
import { convertTaskResponseToTask } from "@/utils/task-utils";
import { cn } from "@/lib/utils";

const priorityColors = {
  low: "bg-gray-100 text-gray-800 border-gray-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-red-100 text-red-800 border-red-300",
};

const priorityIcons = {
  low: Clock,
  medium: AlertCircle,
  high: AlertCircle,
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

export type TaskPreviewModalMethod = {
  open: (task: Task) => void;
  close: () => void;
};

type TaskPreviewModalProps = {
  ref?: React.RefObject<TaskPreviewModalMethod | null>;
  onDelete?: (taskId: string) => void;
};

export const TaskPreviewModal = React.forwardRef<
  TaskPreviewModalMethod | null,
  TaskPreviewModalProps
>(({ onDelete }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [dueDateValue, setDueDateValue] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useImperativeHandle(ref, () => ({
    open: (taskData) => {
      // Get the latest task data from query cache (which we update directly)
      const queryData = queryClient.getQueryData<Task[]>(["tasks"]);
      const latestTask = queryData?.find((t) => t.id === taskData.id) || taskData;
      
      setTask(latestTask);
      setTitleValue(latestTask.title);
      setIsOpen(true);
      
      // Refetch in background to ensure we have server data, but don't wait
      queryClient.refetchQueries({
        queryKey: ["tasks"],
      }).then(() => {
        // After refetch completes, update if modal is still open
        if (isOpen) {
          const freshData = queryClient.getQueryData<Task[]>(["tasks"]);
          const freshTask = freshData?.find((t) => t.id === taskData.id);
          if (freshTask) {
            setTask(freshTask);
            setTitleValue(freshTask.title);
          }
        }
      });
    },
    close: () => setIsOpen(false),
  }));

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Update titleValue and dueDateValue when task changes
  useEffect(() => {
    if (task) {
      setTitleValue(task.title);
      // Convert dueDate from YYYY-MM-DD format to input format
      if (task.dueDate && task.dueDate.trim() !== "") {
        setDueDateValue(task.dueDate);
      } else {
        setDueDateValue("");
      }
    }
  }, [task]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingDueDate && dueDateInputRef.current) {
      dueDateInputRef.current.showPicker?.();
      dueDateInputRef.current.focus();
    }
  }, [isEditingDueDate]);

  const PriorityIcon = task ? priorityIcons[task.priority] : Clock;
  const hasDueDate = task?.dueDate && task.dueDate.trim() !== "";
  const isOverdue =
    hasDueDate &&
    task &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  async function handleDelete() {
    if (!task) return;

    const toastId = toast.loading("Deleting task...");
    const response = await deleteTask(task.id);

    if (!response.success) {
      toast.error(response.message || "Failed to delete task", { id: toastId });
      return;
    }

    toast.success(response.message || "Task deleted successfully", {
      id: toastId,
    });

    // Invalidate and refetch tasks queries
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });

    queryClient.refetchQueries({
      queryKey: ["tasks"],
    });

    setIsOpen(false);
  }

  async function handleTitleSave() {
    if (!task || !titleValue.trim() || titleValue === task.title) {
      setIsEditingTitle(false);
      setTitleValue(task?.title || "");
      return;
    }

    if (titleValue.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      setTitleValue(task.title);
      setIsEditingTitle(false);
      return;
    }

    const toastId = toast.loading("Updating title...");
    const response = await updateTask({
      id: task.id,
      title: titleValue.trim(),
    });

    if (!response.success) {
      toast.error(response.message || "Failed to update title", { id: toastId });
      setTitleValue(task.title);
      setIsEditingTitle(false);
      return;
    }

    toast.success("Title updated!", { id: toastId });
    
    const updatedTaskTitle = titleValue.trim();
    setIsEditingTitle(false);

    // Update local state immediately
    const updatedTask = { ...task, title: updatedTaskTitle };
    setTask(updatedTask);
    
    // Update the query cache directly - this will trigger re-render in TasksBoard
    queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
      if (!oldData) return oldData;
      const newData = oldData.map((t) => 
        t.id === task.id ? updatedTask : t
      );
      return newData;
    });

    // If server response has task data, use it to update cache (more reliable)
    if (response.other?.task) {
      const serverTask = convertTaskResponseToTask(response.other.task);
      setTask(serverTask);
      // Update cache with server response - this will trigger re-render
      queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        const newData = oldData.map((t) => (t.id === task.id ? serverTask : t));
        return newData;
      });
    }

    // Invalidate queries to mark as stale, but cache update above persists
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTitleValue(task?.title || "");
      setIsEditingTitle(false);
    }
  }

  function handleTitleBlur() {
    handleTitleSave();
  }

  async function handleStatusChange(newStatus: "todo" | "in-progress" | "in-review" | "done") {
    if (!task || newStatus === task.status) return;

    const toastId = toast.loading("Updating status...");
    const response = await updateTask({
      id: task.id,
      status: newStatus,
    });

    if (!response.success) {
      toast.error(response.message || "Failed to update status", { id: toastId });
      return;
    }

    toast.success("Status updated!", { id: toastId });

    // Update local state
    const updatedTask = { ...task, status: newStatus };
    setTask(updatedTask);

    // Update cache
    queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((t) => (t.id === task.id ? updatedTask : t));
    });

    // Update cache with server response if available
    if (response.other?.task) {
      const serverTask = convertTaskResponseToTask(response.other.task);
      setTask(serverTask);
      queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) => (t.id === task.id ? serverTask : t));
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  }

  async function handlePriorityChange(newPriority: "low" | "medium" | "high") {
    if (!task || newPriority === task.priority) return;

    const toastId = toast.loading("Updating priority...");
    const response = await updateTask({
      id: task.id,
      priority: newPriority,
    });

    if (!response.success) {
      toast.error(response.message || "Failed to update priority", { id: toastId });
      return;
    }

    toast.success("Priority updated!", { id: toastId });

    // Update local state
    const updatedTask = { ...task, priority: newPriority };
    setTask(updatedTask);

    // Update cache
    queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((t) => (t.id === task.id ? updatedTask : t));
    });

    // Update cache with server response if available
    if (response.other?.task) {
      const serverTask = convertTaskResponseToTask(response.other.task);
      setTask(serverTask);
      queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) => (t.id === task.id ? serverTask : t));
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  }

  async function handleDueDateSave() {
    if (!task) return;

    // If empty, clear the due date
    if (!dueDateValue.trim()) {
      const toastId = toast.loading("Removing due date...");
      const response = await updateTask({
        id: task.id,
        dueDate: null,
      });

      if (!response.success) {
        toast.error(response.message || "Failed to remove due date", { id: toastId });
        setDueDateValue(task.dueDate || "");
        setIsEditingDueDate(false);
        return;
      }

      toast.success("Due date removed!", { id: toastId });
      setIsEditingDueDate(false);

      // Update local state
      const updatedTask = { ...task, dueDate: "" };
      setTask(updatedTask);

      // Update cache
      queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) => (t.id === task.id ? updatedTask : t));
      });

      // Update cache with server response if available
      if (response.other?.task) {
        const serverTask = convertTaskResponseToTask(response.other.task);
        setTask(serverTask);
        queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((t) => (t.id === task.id ? serverTask : t));
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      return;
    }

    // Check if date changed
    if (dueDateValue === task.dueDate) {
      setIsEditingDueDate(false);
      return;
    }

    const toastId = toast.loading("Updating due date...");
    
    // Format date to ISO string
    const formattedDueDate = `${dueDateValue}T00:00:00.000Z`;
    
    const response = await updateTask({
      id: task.id,
      dueDate: formattedDueDate,
    });

    if (!response.success) {
      toast.error(response.message || "Failed to update due date", { id: toastId });
      setDueDateValue(task.dueDate || "");
      setIsEditingDueDate(false);
      return;
    }

    toast.success("Due date updated!", { id: toastId });
    setIsEditingDueDate(false);

    // Update local state
    const updatedTask = { ...task, dueDate: dueDateValue };
    setTask(updatedTask);

    // Update cache
    queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((t) => (t.id === task.id ? updatedTask : t));
    });

    // Update cache with server response if available
    if (response.other?.task) {
      const serverTask = convertTaskResponseToTask(response.other.task);
      setTask(serverTask);
      queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) => (t.id === task.id ? serverTask : t));
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  }

  function handleDueDateKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDueDateSave();
    } else if (e.key === "Escape") {
      setDueDateValue(task?.dueDate || "");
      setIsEditingDueDate(false);
    }
  }

  function handleDueDateBlur() {
    handleDueDateSave();
  }

  if (!task) return null;

  const statusColorMap = {
    todo: "bg-slate-500",
    "in-progress": "bg-blue-500",
    "in-review": "bg-yellow-500",
    done: "bg-green-500",
  };

  return (
    <>
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl p-6">
          {/* Header with Actions */}
          <SheetHeader className="space-y-3 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="size-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  {isEditingTitle ? (
                    <Input
                      ref={titleInputRef}
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      onBlur={handleTitleBlur}
                      onKeyDown={handleTitleKeyDown}
                      className="text-2xl font-bold h-auto py-1 px-0 border-0 border-b-2 border-primary rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  ) : (
                    <h1
                      className="text-2xl font-bold leading-tight break-words cursor-text hover:bg-muted/50 rounded px-1 -mx-1 py-0.5 transition-colors"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      {task.title}
                    </h1>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <Button size="icon" variant="ghost" className="size-8">
                  <Share2 className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8">
                  <Star className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  className="size-8"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Properties Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Properties
              </h2>
              
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        statusColorMap[task.status as keyof typeof statusColorMap] ||
                          "bg-gray-500"
                      )}
                    />
                    <span>Status</span>
                  </div>
                  <div className="w-full max-w-[200px] flex justify-end">
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          value as "todo" | "in-progress" | "in-review" | "done"
                        )
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "!w-fit !h-auto !border-0 !shadow-none hover:opacity-80 transition-opacity cursor-pointer !focus-visible:ring-0 !focus-visible:ring-offset-0 !bg-transparent !p-0 !px-0 !py-0 !rounded-none !gap-0 data-[placeholder]:opacity-100 [&>svg]:!hidden"
                        )}
                      >
                        <SelectValue className="!flex !items-center !justify-center !gap-0">
                          <Badge
                            className={cn(
                              "justify-center border rounded-md px-2.5 py-1 text-xs font-medium",
                              statusColorMap[task.status as keyof typeof statusColorMap] &&
                                "bg-opacity-20 text-foreground border-0"
                            )}
                            variant="outline"
                          >
                            {statusLabels[task.status as keyof typeof statusLabels] ||
                              task.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <PriorityIcon className="size-4 shrink-0" />
                    <span>Priority</span>
                  </div>
                  <div className="w-full max-w-[200px] flex justify-end">
                    <Select
                      value={task.priority}
                      onValueChange={(value) =>
                        handlePriorityChange(value as "low" | "medium" | "high")
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "!w-fit !h-auto !border-0 !shadow-none hover:opacity-80 transition-opacity cursor-pointer !focus-visible:ring-0 !focus-visible:ring-offset-0 !bg-transparent !p-0 !px-0 !py-0 !rounded-none !gap-0 data-[placeholder]:opacity-100 [&>svg]:!hidden"
                        )}
                      >
                        <SelectValue className="!flex !items-center !justify-center !gap-0">
                          <Badge
                            className={cn(
                              "justify-center text-sm border rounded-md px-2.5 py-1 font-medium",
                              priorityColors[task.priority]
                            )}
                            variant="outline"
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Assignee */}
                {task.assignee && (
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <User className="size-4 shrink-0" />
                      <span>Developer</span>
                    </div>
                    <div className="flex items-center gap-2 w-full max-w-[200px] justify-end">
                      <Avatar className="size-6 shrink-0">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {task.assignee.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Calendar className="size-4 shrink-0" />
                    <span>Due date</span>
                  </div>
                  <div className="w-full max-w-[200px] flex justify-end">
                    {isEditingDueDate ? (
                      <Input
                        ref={dueDateInputRef}
                        type="date"
                        value={dueDateValue}
                        onChange={(e) => setDueDateValue(e.target.value)}
                        onBlur={handleDueDateBlur}
                        onKeyDown={handleDueDateKeyDown}
                        className="w-fit h-auto py-1 px-2 text-sm border rounded-md focus-visible:ring-2"
                        autoFocus
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex items-center justify-end gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors",
                          hasDueDate && isOverdue && "text-red-500"
                        )}
                        onClick={() => setIsEditingDueDate(true)}
                      >
                        {hasDueDate ? (
                          <>
                            <span>
                              {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                Past Due
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Empty
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Labels */}
                {task.labels && task.labels.length > 0 && (
                  <div className="flex items-start justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground pt-0.5">
                      <List className="size-4 shrink-0" />
                      <span>Labels</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 w-full max-w-[200px] justify-end">
                      {task.labels.map((label) => (
                        <Badge
                          key={label}
                          className="px-2 py-0.5 text-xs"
                          variant="outline"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Count */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <MessageSquare className="size-4 shrink-0" />
                    <span>Comments</span>
                  </div>
                  <div className="w-full max-w-[200px] text-right">
                    <span className="text-sm">
                      {task.comments > 0 ? `${task.comments}` : "Empty"}
                    </span>
                  </div>
                </div>

                {/* Attachments */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Paperclip className="size-4 shrink-0" />
                    <span>Attachments</span>
                  </div>
                  <div className="w-full max-w-[200px] text-right">
                    <span className="text-sm">
                      {task.attachments > 0 ? `${task.attachments}` : "Empty"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Context Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Context
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description || "No description provided"}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Comments Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Comments
              </h2>
              {task.comments > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-xs">
                        {task.assignee?.initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {task.assignee?.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString("pt-BR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No comments yet. Add your first comment below.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet
                </p>
              )}
              <div className="flex items-start gap-3">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 min-w-0">
                  <Textarea
                    className="min-h-20 resize-none"
                    placeholder="Add a comment..."
                  />
                  <div className="flex justify-end">
                    <Button size="sm">Comment</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
});

TaskPreviewModal.displayName = "TaskPreviewModal";

