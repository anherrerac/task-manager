import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import Column from './Column'
import TaskCard from './TaskCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Board({ boardId }) {
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
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
    const newStatus = over.id

    if (!validStatuses.includes(newStatus)) return

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  return (
    <div>
      <button
        onClick={() => addTask('Nueva tarea')}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Agregar tarea
      </button>
      <div className="flex gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Column id="todo" title="Por hacer" tasks={getTasksByStatus('todo')} />
          <Column id="in_progress" title="En progreso" tasks={getTasksByStatus('in_progress')} />
          <Column id="done" title="Hecho" tasks={getTasksByStatus('done')} />
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
    </div>
  )
}

export default Board