import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [titulo, setTitulo] = useState(task.titulo)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (titulo.trim() && titulo !== task.titulo) {
      onUpdate(task.id, { titulo })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur()
    if (e.key === 'Escape') {
      setTitulo(task.titulo)
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group"
    >
      <div className="flex items-start gap-2">
        {/* Handle de drag */}
        <div
          {...attributes}
          {...listeners}
          className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing mt-0.5 select-none"
        >
          ⠿
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-gray-600 text-white text-sm w-full px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h4
              className="text-white text-sm font-medium cursor-text"
              onDoubleClick={() => setIsEditing(true)}
            >
              {task.titulo}
            </h4>
          )}
          {task.descripcion && !isEditing && (
            <p className="text-gray-400 text-xs mt-1">{task.descripcion}</p>
          )}
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs mt-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default TaskCard