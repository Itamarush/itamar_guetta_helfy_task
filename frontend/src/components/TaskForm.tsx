import { useState } from 'react';
import { createTask } from '../services/api';
import type { Task } from '../services/api';

type Props = { onCreated: () => void; tasks: Task[] };

export default function TaskForm({ onCreated, tasks }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('low');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string>('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title required'); return; }
    
    // Check for duplicate task (same title and description)
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const duplicate = tasks.find(task => 
      task.title.toLowerCase() === trimmedTitle.toLowerCase() && 
      task.description.toLowerCase() === trimmedDesc.toLowerCase()
    );
    
    if (duplicate) {
      alert('Task already exists!\nu may edit the old one or delete it.');
      return;
    }
    
    try {
      await createTask({ 
        title: trimmedTitle, 
        description: trimmedDesc, 
        priority,
        dueDate: dueDate || undefined
      });
      setTitle(''); setDesc(''); setPriority('low'); setDueDate('');
      onCreated();
    } catch (err:any) {
      setError(err?.response?.data?.message || 'Error creating task');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      {error && <div className="error">{error}</div>}
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e=>setDesc(e.target.value)} />
      <input 
        type="date" 
        placeholder="Due Date (optional)" 
        value={dueDate} 
        onChange={e=>setDueDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
      <select value={priority} onChange={e=>setPriority(e.target.value as any)}>
        <option value="low">Priority Low</option><option value="medium">Priority Medium</option><option value="high">Priority High</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}
