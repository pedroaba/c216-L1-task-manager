import type { Task } from "@/components/kanban/task-card";
import type { TaskResponse } from "@/http/list-task";
import { getInitials } from "./get-initials";

export function convertTaskResponseToTask(taskResponse: TaskResponse): Task {
  return {
    id: taskResponse.id,
    title: taskResponse.title,
    description: taskResponse.description ?? "",
    status: taskResponse.status,
    priority: taskResponse.priority as "low" | "medium" | "high",
    assignee: taskResponse.assignee
      ? {
          name: taskResponse.assignee.name,
          avatar: `/avatars/${taskResponse.assignee.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
          initials: getInitials(taskResponse.assignee.name),
        }
      : {
          name: "Unassigned",
          avatar: "",
          initials: "UA",
        },
    dueDate: taskResponse.dueDate
      ? (() => {
          // Extract date directly from ISO string (YYYY-MM-DD part before 'T')
          // This preserves the exact date that was saved
          const isoString = taskResponse.dueDate;
          const datePart = isoString.split("T")[0];
          
          // Return the date part if it's valid, otherwise empty string
          if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            return datePart;
          }
          
          return "";
        })()
      : "",
    comments: 0, // TODO: Implement comments count
    attachments: 0, // TODO: Implement attachments count
    labels: taskResponse.labels,
  };
}

