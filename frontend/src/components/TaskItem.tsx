import { useState } from 'react';
import type { Task } from '../services/api';
import { updateTask, deleteTask, toggleTask } from '../services/api';

type Props = { 
  task: Task; 
  onChange: () => void;
  onDragStart?: (task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetTask: Task) => void;
};

export default function TaskItem({ task, onChange, onDragStart, onDragOver, onDrop }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [prio, setPrio] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  async function save() {
    await updateTask(task.id, { 
      title, 
      description: desc, 
      priority: prio,
      dueDate: dueDate || undefined
    });
    setEditing(false); onChange();
  }
  async function del() {
    if (confirm('Delete this task?')) { await deleteTask(task.id); onChange(); }
  }
  async function toggle() {
    await toggleTask(task.id); onChange();
  }

  return (
    <div 
      className={`task-item ${task.completed ? 'task-completed' : ''}`}
      draggable={!editing}
      onDragStart={() => onDragStart?.(task)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, task)}
    >
      {editing ? (
        <div className="card">
          <input 
            value={title} 
            onChange={e=>setTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea 
            value={desc} 
            onChange={e=>setDesc(e.target.value)}
            placeholder="Task description"
            rows={3}
          />
          <select value={prio} onChange={e=>setPrio(e.target.value as any)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input 
            type="date" 
            value={dueDate} 
            onChange={e=>setDueDate(e.target.value)}
            placeholder="Due date (optional)"
            min={new Date().toISOString().split('T')[0]}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={save} style={{ flex: 1 }}>Save Changes</button>
            <button 
              onClick={()=>setEditing(false)} 
              style={{ 
                flex: 1, 
                background: '#f3f4f6', 
                color: '#6b7280' 
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <span className={`task-priority priority-${task.priority}`}>
              {task.priority}
            </span>
          </div>
          
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <div className="task-date">
              Created: {new Date(task.createdAt).toLocaleDateString()}
              {task.dueDate && (
                <div style={{ 
                  color: new Date(task.dueDate) < new Date() ? '#dc2626' : '#059669',
                  fontWeight: '500',
                  marginTop: '4px'
                }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                  {new Date(task.dueDate) < new Date() && ' (Overdue!)'}
                </div>
              )}
            </div>
            
            <div className="task-actions">
              <button onClick={toggle}className="task-btn complete-btn">
                {task.completed ? '↶ Undo' : '✓ Done'}
              </button>
              <button onClick={()=>setEditing(true)}className="task-btn edit-btn">✎ Edit
              </button>
              <button onClick={del}className="task-btn delete-btn">🗑 Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
