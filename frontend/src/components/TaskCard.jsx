import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskModal from './TaskModal'

function TaskCard({ task, onDelete, onUpdate }) {
  const [showModal, setShowModal] = useState(false)

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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group"
      >
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing mt-0.5 select-none"
          >
            ⠿
          </div>
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <h4 className="text-white text-sm font-medium">{task.titulo}</h4>
            {task.descripcion && (
              <p className="text-gray-400 text-xs mt-1 truncate">{task.descripcion}</p>
            )}
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs mt-0.5"
          >
            ✕
          </button>
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  )
}

export default TaskCard