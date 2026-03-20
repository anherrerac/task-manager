import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function TaskCard({ task }) {
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
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-grab active:cursor-grabbing border border-gray-600 hover:border-gray-500 transition-colors"
    >
      <h4 className="text-white text-sm font-medium mb-1">{task.titulo}</h4>
      {task.descripcion && (
        <p className="text-gray-400 text-xs">{task.descripcion}</p>
      )}
    </div>
  )
}

export default TaskCard