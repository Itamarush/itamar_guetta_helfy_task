# Task Manager App

A clean and simple task management tool I made for the Helfy coding assignment.

## How to Run

### Backend Setup
1. Open terminal and go to backend folder:
   ```
   cd backend
   ```
2. Install stuff:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   Server runs on http://localhost:4000

### Frontend Setup  
1. Open another terminal and go to frontend folder:
   ```
   cd frontend
   ```
2. Install stuff:
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
   App runs on http://localhost:3000

## API Endpoints

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task  
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- PATCH /api/tasks/:id/toggle - Mark done/undone

## What I Built

The app has:
- Add new tasks with title, description, priority and due date
- Edit existing tasks 
- Delete tasks
- Mark tasks as done/not done
- Search tasks by title or description
- Filter tasks (all/completed/pending)
- Sort tasks by date, title, priority, due date
- Drag and drop to reorder tasks
- Dark/light theme toggle
- Endless carousel that shows 4 tasks at a time with smooth animation
- Everything saves to localStorage if server is down

## Design Decisions

- Used React hooks instead of class components because they're easier
- Put all CSS in one file to keep it simple
- Made the carousel animate automatically but pause on hover
- Added drag and drop because it looked cool
- Used in-memory storage on backend (no database) as required
- Added extra features like search, sorting, themes because I had time

## Time Spent

- Backend API: ~90 minutes (setting up routes, validation, error handling)
- Frontend Core: ~120 minutes (components, carousel, CRUD operations) 
- Styling: ~45 minutes (CSS, responsive design, themes)
- Extra Features: ~60 minutes (search, sort, drag-drop, localStorage)
- Testing/Debugging: ~30 minutes

Total: about 5.5 hours (went a bit over the 4 hour limit because I wanted to add cool features)

## Notes

- The carousel is the main feature - it smoothly loops through tasks
- Everything works offline thanks to localStorage
- No external libraries used for carousel (built from scratch)
- Mobile responsive design - not implemented ( no time)
