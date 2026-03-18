import { Droppable } from '@hello-pangea/dnd';
import { Task, TaskStatus, Column } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (status: TaskStatus) => void;
}

const columnAccents: Record<TaskStatus, string> = {
  todo: 'from-blue-500/10',
  in_progress: 'from-amber-500/10',
  pending: 'from-purple-500/10',
  completed: 'from-emerald-500/10',
};

const dotColors: Record<TaskStatus, string> = {
  todo: 'bg-blue-400',
  in_progress: 'bg-amber-400',
  pending: 'bg-purple-400',
  completed: 'bg-emerald-400',
};

export function KanbanColumn({ column, tasks, onEdit, onDelete, onAdd }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] w-full">
      {/* Column Header */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2.5 mb-3 rounded-lg',
        'bg-gradient-to-r to-transparent',
        columnAccents[column.id]
      )}>
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', dotColors[column.id])} />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
            {column.title}
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted/80 rounded-full px-2 py-0.5 font-semibold">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => onAdd(column.id)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 rounded-xl bg-kanban-column/50 p-2 space-y-2 min-h-[200px] transition-all duration-200 scrollbar-thin overflow-y-auto',
              snapshot.isDraggingOver && 'bg-primary/5 ring-1 ring-primary/20 shadow-inner'
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
