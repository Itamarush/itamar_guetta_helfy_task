export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // store as ISO string
  priority: Priority;
  dueDate?: string; // optional due date as ISO string
}
