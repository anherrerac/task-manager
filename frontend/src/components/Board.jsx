import { useState, useEffect } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import Column from './Column'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Board({ boardId }) {
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
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

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const validStatuses = ['todo', 'in_progress', 'done']
    let newStatus = over.id

    if (!validStatuses.includes(newStatus)) {
      const overTask = tasks.find(t => t.id === over.id)
      if (!overTask) return
      newStatus = overTask.estado
    }

    const task = tasks.find(t => t.id === active.id)
    if (!task || task.estado === newStatus) return

    setTasks(prev => prev.map(t =>
      t.id === active.id ? { ...t, estado: newStatus } : t
    ))

    try {
      await api.put(`/tasks/${active.id}`, {
        titulo: task.titulo,
        descripcion: task.descripcion,
        estado: newStatus
      })
    } catch (err) {
      console.error('Error actualizando tarea:', err)
      fetchTasks()
    }
  }

  const handleCreateTask = async ({ titulo, descripcion, estado }) => {
    try {
      const response = await api.post('/tasks', {
        titulo,
        descripcion,
        estado,
        board_id: boardId,
        user_id: user.id
      })
      setTasks(prev => [...prev, response.data])
    } catch (err) {
      console.error('Error creando tarea:', err)
    }
  }

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    try {
      await api.delete(`/tasks/${taskId}`)
    } catch (err) {
      console.error('Error eliminando tarea:', err)
      fetchTasks()
    }
  }

  const updateTask = async (taskId, updates) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    ))
    try {
      const task = tasks.find(t => t.id === taskId)
      await api.put(`/tasks/${taskId}`, {
        titulo: updates.titulo || task.titulo,
        descripcion: updates.descripcion !== undefined ? updates.descripcion : task.descripcion,
        estado: updates.estado || task.estado
      })
    } catch (err) {
      console.error('Error actualizando tarea:', err)
      fetchTasks()
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  return (
    <div>
      <button
        onClick={() => setShowCreateModal(true)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Agregar tarea
      </button>

      <div className="flex gap-4 w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          autoScroll={true}
        >
          <Column id="todo" title="Por hacer" tasks={getTasksByStatus('todo')} onDelete={deleteTask} onUpdate={updateTask} />
          <Column id="in_progress" title="En progreso" tasks={getTasksByStatus('in_progress')} onDelete={deleteTask} onUpdate={updateTask} />
          <Column id="done" title="Hecho" tasks={getTasksByStatus('done')} onDelete={deleteTask} onUpdate={updateTask} />
          <DragOverlay>
            {activeTask && (
              <div className="bg-gray-700 border border-blue-500 p-3 rounded-lg shadow-xl opacity-95 cursor-grabbing">
                <h4 className="text-white text-sm font-medium">{activeTask.titulo}</h4>
                {activeTask.descripcion && (
                  <p className="text-gray-400 text-xs mt-1">{activeTask.descripcion}</p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  )
}

export default Board