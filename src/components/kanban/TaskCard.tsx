import { Draggable } from '@hello-pangea/dnd';
import { Task, LABEL_COLORS } from '@/types/kanban';
import { Calendar, User, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<string, string> = {
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
};

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group rounded-lg bg-kanban-card p-3.5 transition-all duration-200 cursor-grab active:cursor-grabbing',
            'hover:bg-kanban-card-hover border border-transparent',
            snapshot.isDragging && 'border-kanban-drag/40 shadow-lg shadow-kanban-drag/10 scale-[1.02] rotate-[1deg]'
          )}
          onClick={() => onEdit(task)}
        >
          {/* Priority + Actions */}
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className={cn('text-[10px] uppercase tracking-wider font-semibold border px-1.5 py-0', priorityStyles[task.priority])}
            >
              {task.priority}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h4 className="font-medium text-sm text-foreground leading-snug mb-1">{task.title}</h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5">{task.description}</p>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    LABEL_COLORS[label] || 'bg-muted text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Footer: date + assignee */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {task.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), 'MMM d')}
              </span>
            )}
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.assignee}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
