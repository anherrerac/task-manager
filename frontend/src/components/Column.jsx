import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

function Column({ id, title, tasks, onDelete, onUpdate }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className="bg-gray-800 rounded-xl p-4 flex-1 flex flex-col h-[450px]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="font-semibold text-gray-200">{title}</h3>
        <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 pr-1 min-h-full">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default Column