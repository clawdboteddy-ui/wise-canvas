import { Draggable } from '@hello-pangea/dnd';
import { Task, LABEL_COLORS } from '@/types/kanban';
import { Calendar, User, MoreHorizontal, Trash2, Pencil, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
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

const priorityConfig = {
  low: {
    icon: ArrowDown,
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    accent: 'border-l-emerald-500',
  },
  medium: {
    icon: ArrowRight,
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accent: 'border-l-amber-500',
  },
  high: {
    icon: ArrowUp,
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    accent: 'border-l-rose-500',
  },
};

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group rounded-lg p-3.5 transition-all duration-200 cursor-grab active:cursor-grabbing',
            'bg-gradient-to-br from-kanban-card to-kanban-card/80',
            'border border-border/50 border-l-[3px]',
            priority.accent,
            'hover:border-border hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5',
            snapshot.isDragging && 'border-primary/40 shadow-xl shadow-primary/15 scale-[1.03] rotate-[1.5deg] z-50'
          )}
          onClick={() => onEdit(task)}
        >
          {/* Priority + Actions */}
          <div className="flex items-center justify-between mb-2.5">
            <Badge
              variant="outline"
              className={cn('text-[10px] uppercase tracking-wider font-semibold border px-1.5 py-0.5 gap-1', priority.badge)}
            >
              <PriorityIcon className="h-2.5 w-2.5" />
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
                    'text-[10px] px-2 py-0.5 rounded-full font-medium',
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
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary">{task.assignee.charAt(0).toUpperCase()}</span>
                </div>
                {task.assignee}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
