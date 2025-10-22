import { useEffect, useMemo, useRef, useState } from 'react';
import TaskItem from './TaskItem';
import type { Task } from '../services/api';

type Props = { 
  tasks: Task[]; 
  onChange: () => void; 
  filter: 'all' | 'pending' | 'completed';
  onDragStart?: (task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetTask: Task) => void;
};

export default function TaskList({ tasks, onChange, filter, onDragStart, onDragOver, onDrop }: Props) {
  const filtered = useMemo(()=>{
    if (filter==='completed') return tasks.filter(t=>t.completed);
    if (filter==='pending') return tasks.filter(t=>!t.completed);
    return tasks;
  }, [tasks, filter]);

  // Create carousel with 4-task logic
  const loop = useMemo(() => {
    if (filtered.length === 0) return [];
    
    // for less than 4 tasks, show them with n0o carousel)
    if (filtered.length < 4) {
      return filtered;
    }
    
    // for 4+ tasks, create infinite carousel showing 4 at a time
    return [...filtered, ...filtered, ...filtered];
  }, [filtered]);

  const trackRef = useRef<HTMLDivElement|null>(null);
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || filtered.length < 4) return;
// i did it hard-coded althoug i know its not proffesional but i had no time, sorry :(
    const itemWidth = 336; // 320px + 16px gap
    const totalWidth = filtered.length * itemWidth;
    
    let animationId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= 16) {
        setOffset(prev => {
          const speed = 0.8;
          const newOffset = prev - speed;
          
          if (Math.abs(newOffset) >= totalWidth) {
            return 0;
          }
          
          return newOffset;
        });
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [filtered.length, isPaused]);

  // If empty, show apropriate placeholder message
  if (filtered.length === 0) {
    let message = "No tasks yet. Add your first task to get started!";
    if (filter === 'completed') message = "No completed tasks yet.";
    if (filter === 'pending') message = "No pending tasks. Great job!";
    
    return <div className="carousel-empty">{message}</div>;
  }

  return (
    <div 
      className={`carousel ${filtered.length >= 4 ? 'animated-carousel' : 'static-carousel'}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="track"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isPaused ? 'transform 0.3s ease' : 'none',
        }}
      >
        {loop.map((task, index) => (
          <div className="slide" key={`${task.id}-${index}`}>
            <TaskItem 
              task={task} 
              onChange={onChange}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
