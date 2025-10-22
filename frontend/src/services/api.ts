import axios from 'axios';

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: Priority;
  dueDate?: string;
};

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

export const getTasks = () => api.get<Task[]>('/tasks').then(r => r.data);

export const createTask = (data: Pick<Task, 'title'|'description'|'priority'|'dueDate'>) =>
  api.post<Task>('/tasks', data).then(r => r.data);

export const updateTask = (id: number, patch: Partial<Omit<Task,'id'|'createdAt'>>) =>
  api.put<Task>(`/tasks/${id}`, patch).then(r => r.data);

export const deleteTask = (id: number) =>
  api.delete<void>(`/tasks/${id}`).then(r => r.data);

export const toggleTask = (id: number) =>
  api.patch<Task>(`/tasks/${id}/toggle`, {}).then(r => r.data);
