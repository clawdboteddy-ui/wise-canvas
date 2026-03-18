import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { COLUMNS, TaskStatus, Task } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { TaskEditDialog } from './TaskEditDialog';
import { AIChatSidebar } from './AIChatSidebar';
import { useTasks } from '@/hooks/useTasks';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface KanbanBoardProps {
  aiOpen: boolean;
  onAiClose: () => void;
}

export function KanbanBoard({ aiOpen, onAiClose }: KanbanBoardProps) {
  const { tasks, loading, createTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  // Keyboard shortcut: N to create task
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleAdd('todo');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId as TaskStatus, destination.index);
  }, [moveTask]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsNewTask(false);
    setDialogOpen(true);
  };

  const handleAdd = (status: TaskStatus) => {
    setEditingTask(null);
    setIsNewTask(true);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    toast.success('Task deleted');
  };

  const handleSave = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    toast.success('Task updated');
  };

  const handleCreate = async (task: Partial<Task>) => {
    await createTask(task);
    toast.success('Task created');
  };

  const handleAIAction = async (action: any) => {
    if (action.action === 'create_task') {
      await createTask(action.task);
      toast.success(`AI created: ${action.task.title}`);
    } else if (action.action === 'move_task') {
      await moveTask(action.task_id, action.new_status, 0);
      toast.success('AI moved task');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Board */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Board</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} · Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">N</kbd> to create
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => handleAdd('todo')}
            className="gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>

        {/* Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {COLUMNS.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* AI Sidebar */}
      <AIChatSidebar
        open={aiOpen}
        onClose={onAiClose}
        tasks={tasks}
        onAction={handleAIAction}
      />

      {/* Edit/Create Dialog */}
      <TaskEditDialog
        task={editingTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onCreate={handleCreate}
        isNew={isNewTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
