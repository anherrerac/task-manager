import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className="bg-gray-800 rounded-xl p-4 w-72 min-h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-200">{title}</h3>
        <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 flex-1">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column