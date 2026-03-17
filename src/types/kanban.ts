export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  due_date: string | null;
  assignee: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  icon: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', icon: '○' },
  { id: 'in_progress', title: 'In Progress', icon: '◑' },
  { id: 'pending', title: 'Pending', icon: '◶' },
  { id: 'completed', title: 'Completed', icon: '●' },
];

export const LABEL_COLORS: Record<string, string> = {
  bug: 'bg-red-500/20 text-red-400',
  feature: 'bg-blue-500/20 text-blue-400',
  design: 'bg-purple-500/20 text-purple-400',
  docs: 'bg-yellow-500/20 text-yellow-400',
  refactor: 'bg-green-500/20 text-green-400',
  urgent: 'bg-orange-500/20 text-orange-400',
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
