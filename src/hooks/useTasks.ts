import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/kanban';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      toast.error('Failed to load tasks');
      console.error(error);
      return;
    }
    setTasks((data as Task[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchTasks]);

  const createTask = useCallback(async (task: Partial<Task>) => {
    const columnTasks = tasks.filter(t => t.status === (task.status || 'todo'));
    const maxPos = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.position)) : -1;

    const newTask = {
      title: task.title || 'New Task',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      labels: task.labels || [],
      due_date: task.due_date || null,
      assignee: task.assignee || '',
      position: maxPos + 1,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      toast.error('Failed to create task');
      console.error(error);
      return null;
    }
    return data as Task;
  }, [tasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  }, []);

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, position: newPosition })
      .eq('id', taskId);

    if (error) {
      toast.error('Failed to move task');
      fetchTasks(); // rollback
    }
  }, [fetchTasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => a.position - b.position);
  }, [tasks]);

  return { tasks, loading, createTask, updateTask, deleteTask, moveTask, getTasksByStatus };
}
