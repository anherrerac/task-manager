# Task Manager

A full-stack task management application inspired by Jira, built with React, Node.js, Express and PostgreSQL.

🔗 **Live Demo**: [taskmanager-frontend-two-rho.vercel.app](https://taskmanager-frontend-two-rho.vercel.app)

## 🚀 Features

- JWT Authentication (register, login, logout)
- Create and manage multiple Kanban boards
- Create, edit and delete tasks with title and description
- Drag and drop tasks between columns (To Do, In Progress, Done)
- Task detail modal for editing
- Persistent data with PostgreSQL
- Secure password hashing with bcrypt
- Protected routes on frontend and backend
- Responsive dark mode UI

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- dnd-kit (drag and drop)
- Context API (global state)

**Backend**
- Node.js + Express
- JWT (jsonwebtoken)
- bcrypt
- PostgreSQL
- pg (node-postgres)

**DevOps**
- Git + GitHub
- Vercel (frontend deploy)
- Render (backend + database deploy)

## 🏗️ Architecture

3-tier architecture with REST API:
```
React (Frontend) → Node.js + Express (API REST) → PostgreSQL (Database)
```

## 📁 Project Structure
```
task-manager/
  frontend/
    src/
      components/   # Board, Column, TaskCard, TaskModal
      pages/        # Login, Register, Dashboard
      services/     # Axios API client
      context/      # Auth context (JWT + localStorage)
  backend/
    routes/         # auth, users, boards, tasks
    middleware/     # JWT verification
    db/             # PostgreSQL connection pool
```

## ⚙️ Local Setup

### Prerequisites
- Node.js
- PostgreSQL

### Backend
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=yourjwtsecret
```

Create database and tables:
```sql
CREATE DATABASE taskmanager;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'todo',
  orden INTEGER DEFAULT 0,
  board_id INTEGER REFERENCES boards(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## 🔐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login | No |
| POST | /api/users | Register | No |
| GET | /api/boards/user/:id | Get user boards | Yes |
| POST | /api/boards | Create board | Yes |
| DELETE | /api/boards/:id | Delete board + tasks | Yes |
| GET | /api/tasks/board/:id | Get board tasks | Yes |
| POST | /api/tasks | Create task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |

## 👨‍💻 Author

Andrés Herrera — [GitHub](https://github.com/anherrerac)