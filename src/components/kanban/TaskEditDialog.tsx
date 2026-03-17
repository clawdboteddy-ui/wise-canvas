import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, COLUMNS, LABEL_COLORS } from '@/types/kanban';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskEditDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Task>) => void;
  onCreate: (task: Partial<Task>) => void;
  isNew?: boolean;
  defaultStatus?: TaskStatus;
}

const AVAILABLE_LABELS = Object.keys(LABEL_COLORS);

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
  onSave,
  onCreate,
  isNew = false,
  defaultStatus = 'todo',
}: TaskEditDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    if (task && !isNew) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setLabels(task.labels || []);
      setDueDate(task.due_date || '');
      setAssignee(task.assignee);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(defaultStatus);
      setLabels([]);
      setDueDate('');
      setAssignee('');
    }
  }, [task, isNew, defaultStatus]);

  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description,
      priority,
      status,
      labels,
      due_date: dueDate || null,
      assignee,
    };
    if (isNew) {
      onCreate(data);
    } else if (task) {
      onSave(task.id, data);
    }
    onOpenChange(false);
  };

  const toggleLabel = (label: string) => {
    setLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
              className="bg-background"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              className="bg-background min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map(col => (
                    <SelectItem key={col.id} value={col.id}>{col.icon} {col.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Assignee</Label>
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Name..."
                className="bg-background"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Labels</Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_LABELS.map(label => (
                <button
                  key={label}
                  onClick={() => toggleLabel(label)}
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-medium transition-all border',
                    labels.includes(label)
                      ? cn(LABEL_COLORS[label], 'border-current')
                      : 'bg-muted text-muted-foreground border-transparent hover:border-muted-foreground/30'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {isNew ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
