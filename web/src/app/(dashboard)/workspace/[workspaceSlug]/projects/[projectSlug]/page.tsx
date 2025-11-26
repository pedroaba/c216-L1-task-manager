import { TasksBoard } from "./_components/tasks-board";
import { TaskCreateModal } from "./_components/task-create-modal";

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
          <TaskCreateModal />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="min-h-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden pb-6">
        <TasksBoard />
      </div>
    </div>
  );
}
