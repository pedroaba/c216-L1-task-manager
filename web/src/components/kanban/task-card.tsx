"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  dueDate: string;
  comments: number;
  attachments: number;
  labels: string[];
};

type TaskCardProps = {
  task: Task;
  columnId: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onPreview?: (task: Task) => void;
};

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

export function TaskCard({
  task,
  columnId,
  onEdit,
  onDelete,
  onPreview,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const PriorityIcon = priorityIcons[task.priority];
  const hasDueDate = task.dueDate && task.dueDate.trim() !== "";
  const isOverdue =
    hasDueDate && new Date(task.dueDate) < new Date() && columnId !== "done";

  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      className={cn(isDragging && "opacity-50")}
      ref={setNodeRef}
      style={style}
    >
      <Card
        className="cursor-pointer p-0 transition-shadow hover:shadow-md"
        onMouseDown={(e) => {
          // Store initial mouse position for drag detection
          dragStartPosition.current = { x: e.clientX, y: e.clientY };
        }}
        onClick={(e) => {
          // Don't open preview if clicking on dropdown menu or buttons
          if (
            (e.target as HTMLElement).closest('[role="menuitem"]') ||
            (e.target as HTMLElement).closest('button[aria-haspopup="menu"]') ||
            (e.target as HTMLElement).closest("button")
          ) {
            return;
          }

          // Don't open preview if this was a drag (mouse moved more than 5px)
          if (dragStartPosition.current) {
            const distance = Math.sqrt(
              Math.pow(e.clientX - dragStartPosition.current.x, 2) +
                Math.pow(e.clientY - dragStartPosition.current.y, 2)
            );
            if (distance > 5) {
              dragStartPosition.current = null;
              return;
            }
          }

          dragStartPosition.current = null;
          onPreview?.(task);
        }}
        {...attributes}
        {...listeners}
      >
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="flex-1 font-semibold text-sm leading-tight">
              {task.title}
            </h4>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="-mt-1 -mr-1 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="line-clamp-2 text-muted-foreground text-xs">
            {task.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 p-0">
          <div className="space-y-3 p-4">
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <Badge
                    className="px-2 py-0 text-xs"
                    key={label}
                    variant="outline"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Badge
                className={`text-xs ${priorityColors[task.priority]}`}
                variant="outline"
              >
                <PriorityIcon className="mr-1 size-3" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 pt-1">
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              {task.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="size-3.5" />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="size-3.5" />
                  <span>{task.attachments}</span>
                </div>
              )}
              {hasDueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-red-500"
                  )}
                >
                  <Calendar className="size-3.5" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
            </div>

            <Avatar className="size-7">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
