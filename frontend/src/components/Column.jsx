import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id })

  const columnStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '16px',
    width: '300px',
    minHeight: '500px'
  }

  const titleStyle = {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  }

  return (
    <div style={columnStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column