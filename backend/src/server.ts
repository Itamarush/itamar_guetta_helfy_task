import express from 'express';
import cors from 'cors';
import { Task, Priority } from './types';

const app = express();
app.use(cors());
app.use(express.json());

let tasks: Task[] = [];
let nextId = 1;

function isPriority(x: any): x is Priority {
  return x === 'low' || x === 'medium' || x === 'high';
}

app.get('/api/tasks', (_req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description = '', priority, dueDate } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ message: 'title is required' });
  if (!isPriority(priority)) return res.status(400).json({ message: 'priority must be low|medium|high' });
  if (dueDate && (typeof dueDate !== 'string' || isNaN(Date.parse(dueDate))))
    return res.status(400).json({ message: 'invalid due date' });

  const newTask: Task = {
    id: nextId++,
    title: title.trim(),
    description: String(description || ''),
    completed: false,
    createdAt: new Date().toISOString(),
    priority,
    ...(dueDate ? { dueDate } : {})
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'task not found' });

  const { title, description, completed, priority, dueDate } = req.body || {};
  if (title !== undefined && (typeof title !== 'string' || !title.trim()))
    return res.status(400).json({ message: 'invalid title' });
  if (priority !== undefined && !isPriority(priority))
    return res.status(400).json({ message: 'invalid priority' });
  if (completed !== undefined && typeof completed !== 'boolean')
    return res.status(400).json({ message: 'invalid completed' });
  if (dueDate !== undefined && dueDate !== null && (typeof dueDate !== 'string' || isNaN(Date.parse(dueDate))))
    return res.status(400).json({ message: 'invalid due date' });

  const task = tasks[idx]!;
  const updated: Task = {
    id: task.id,
    title: title !== undefined ? title.trim() : task.title,
    description: description !== undefined ? String(description) : task.description,
    completed: completed !== undefined ? completed : task.completed,
    createdAt: task.createdAt,
    priority: priority !== undefined ? priority : task.priority,
    dueDate: dueDate !== undefined ? (dueDate || undefined) : task.dueDate
  };
  tasks[idx] = updated;
  res.json(updated);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) return res.status(404).json({ message: 'task not found' });
  res.status(204).send();
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'task not found' });
  task.completed = !task.completed;
  res.json(task);
});

app.use((_req, res) => res.status(404).json({ message: 'route not found' }));

app.listen(4000, () => console.log('API on http://localhost:4000'));
