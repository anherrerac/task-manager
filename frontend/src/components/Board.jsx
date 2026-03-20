import { useState, useEffect } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './Column'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Board({ boardId }) {
  const [tasks, setTasks] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    fetchTasks()
  }, [boardId])

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/board/${boardId}`)
      setTasks(response.data)
    } catch (err) {
      console.error('Error cargando tareas:', err)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.estado === status)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const newStatus = over.id

    if (activeTask.estado === newStatus) return

    setTasks(prev => prev.map(t =>
      t.id === active.id ? { ...t, estado: newStatus } : t
    ))

    try {
      await api.put(`/tasks/${active.id}`, {
        titulo: activeTask.titulo,
        descripcion: activeTask.descripcion,
        estado: newStatus
      })
    } catch (err) {
      console.error('Error actualizando tarea:', err)
      fetchTasks()
    }
  }

  const addTask = async (titulo) => {
    try {
      const response = await api.post('/tasks', {
        titulo,
        descripcion: '',
        board_id: boardId,
        user_id: user.id
      })
      setTasks(prev => [...prev, response.data])
    } catch (err) {
      console.error('Error creando tarea:', err)
    }
  }

  return (
    <div>
      <button onClick={() => addTask('Nueva tarea')}>+ Agregar tarea</button>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Column id="todo" title="Por hacer" tasks={getTasksByStatus('todo')} />
          <Column id="in_progress" title="En progreso" tasks={getTasksByStatus('in_progress')} />
          <Column id="done" title="Hecho" tasks={getTasksByStatus('done')} />
        </DndContext>
      </div>
    </div>
  )
}

export default Board