import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import type { Task } from "@/components/kanban/task-card";
import { Button } from "@/components/ui/button";

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create mockups for the new landing page design",
    status: "todo",
    priority: "high",
    assignee: {
      name: "João Silva",
      avatar: "/avatars/joao.jpg",
      initials: "JS",
    },
    dueDate: "2024-02-15",
    comments: 3,
    attachments: 2,
    labels: ["design", "ui/ux"],
  },
  {
    id: "2",
    title: "Implement authentication",
    description: "Add JWT authentication to the API",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      initials: "MS",
    },
    dueDate: "2024-02-20",
    comments: 5,
    attachments: 1,
    labels: ["backend", "security"],
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    status: "in-progress",
    priority: "low",
    assignee: {
      name: "Pedro Alves",
      avatar: "/avatars/pedro.jpg",
      initials: "PA",
    },
    dueDate: "2024-02-18",
    comments: 1,
    attachments: 0,
    labels: ["documentation"],
  },
  {
    id: "4",
    title: "Fix responsive issues",
    description: "Fix mobile responsive layout issues on dashboard",
    status: "in-progress",
    priority: "high",
    assignee: {
      name: "Ana Costa",
      avatar: "/avatars/ana.jpg",
      initials: "AC",
    },
    dueDate: "2024-02-16",
    comments: 8,
    attachments: 3,
    labels: ["frontend", "bug"],
  },
  {
    id: "5",
    title: "Database migration",
    description: "Migrate database to PostgreSQL",
    status: "in-review",
    priority: "high",
    assignee: {
      name: "Carlos Mendes",
      avatar: "/avatars/carlos.jpg",
      initials: "CM",
    },
    dueDate: "2024-02-14",
    comments: 12,
    attachments: 5,
    labels: ["database", "backend"],
  },
  {
    id: "6",
    title: "Code review PR #234",
    description: "Review pull request for new feature implementation",
    status: "in-review",
    priority: "medium",
    assignee: {
      name: "João Silva",
      avatar: "/avatars/joao.jpg",
      initials: "JS",
    },
    dueDate: "2024-02-17",
    comments: 4,
    attachments: 0,
    labels: ["review"],
  },
  {
    id: "7",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated deployment",
    status: "done",
    priority: "high",
    assignee: {
      name: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      initials: "MS",
    },
    dueDate: "2024-02-10",
    comments: 6,
    attachments: 2,
    labels: ["devops", "automation"],
  },
  {
    id: "8",
    title: "Write unit tests",
    description: "Add unit tests for user service",
    status: "done",
    priority: "medium",
    assignee: {
      name: "Pedro Alves",
      avatar: "/avatars/pedro.jpg",
      initials: "PA",
    },
    dueDate: "2024-02-12",
    comments: 2,
    attachments: 0,
    labels: ["testing", "backend"],
  },
];

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "in-review", title: "In Review", color: "bg-yellow-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

export default async function Project() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Project Board</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track your project tasks
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="min-h-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden pb-6">
        <KanbanBoard columns={columns} initialTasks={mockTasks} />
      </div>
    </div>
  );
}
