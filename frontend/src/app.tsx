import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import { getTasks } from './services/api';
import type { Task } from './services/api';
import './styles/index.css';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterOption, setFilterOption] = useState<'all'|'completed'|'pending'>('all');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode') || 'false'));

  async function load() {
    try {
      setLoading(true); setError('');
      const data = await getTasks();
      setTasks(data);
      localStorage.setItem('tasks', JSON.stringify(data));
    } catch (e: any) {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
        setError('Loaded from local storage (server offline)');
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    setTasks(newTasks);
    setDraggedTask(null);
  };

  const filteredTasks = tasks
    .filter(task => {
      // im filtering by a search query, hopes this works i had no time to test
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // im filtering by completion status, hope this works too
      if (filterOption === 'completed') return task.completed;
      if (filterOption === 'pending') return !task.completed;
      return true; // 'all'
    })
    .sort((a, b) => {
      const [field, order] = sortOption.split('-');
      let comparison = 0;
      if (field === 'title') comparison = a.title.localeCompare(b.title);
      else if (field === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (field === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (field === 'dueDate') {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Date.now() + 1000000000;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Date.now() + 1000000000;
        comparison = aDate - bDate;
      }
      return order === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="app">
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="logo">✓ TaskManager</div>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          </div>
          {sidebarOpen && (
            <div className="sidebar-content">
              <button className="add-task-btn" onClick={() => setShowAddModal(true)}>+ Add Task</button>
              <div className="search-bar">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input type="text" placeholder="Search tasks..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')} title="Clear search">×</button>}
                </div>
              </div>
              <div className="sort-controls">
                <select className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="date-desc">📅 Date (Newest First)</option>
                  <option value="date-asc">📅 Date (Oldest First)</option>
                  <option value="title-asc">🔤 Title (A-Z)</option>
                  <option value="title-desc">🔤 Title (Z-A)</option>
                  <option value="priority-desc">⚡ Priority High</option>
                  <option value="priority-asc">⚡ Priority Low</option>
                  <option value="dueDate-asc">📋 Due Date (Soon-Later)</option>
                  <option value="dueDate-desc">📋 Due Date (Later-Soon)</option>
                </select>
              </div>
              <div className="sidebar-section">
                <h3>Filter Tasks</h3>
                <TaskFilter value={filterOption} onChange={setFilterOption} />
              </div>
              <div className="sidebar-section">
                <h3>My Tasks</h3>
                <div className="task-count">
                  <span>All tasks</span>
                  <span className="count">{filteredTasks.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="main-content">
          <div className="content-header">
            <h1>All Tasks</h1>
            <button className="theme-toggle-header" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="content-body">
            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <h2>Ready to get stuff done?</h2>
                <p>Start by adding your first task and watch your productivity soar.</p>
                <p>Everything saves automatically as you work.</p>
                <button className="create-task-btn" onClick={() => setShowAddModal(true)}>Create your first task</button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <h2>No tasks found</h2>
                <p>No tasks match your search criteria.</p>
                <p>Try adjusting your search terms.</p>
              </div>
            ) : (
              <TaskList tasks={filteredTasks} onChange={load} filter="all" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
            )}
          </div>
        </div>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Task</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <TaskForm onCreated={() => { setShowAddModal(false); load(); }} tasks={tasks} />
            </div>
          </div>
        )}
    </div>
  );
}
