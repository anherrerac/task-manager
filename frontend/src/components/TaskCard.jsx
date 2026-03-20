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
    backgroundColor: 'white',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    cursor: 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h4 style={{ margin: '0 0 4px 0' }}>{task.titulo}</h4>
      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
        {task.descripcion}
      </p>
    </div>
  )
}

export default TaskCard