import { useState } from 'react'

function TaskModal({ task, onClose, onUpdate, onDelete }) {
  const [titulo, setTitulo] = useState(task.titulo)
  const [descripcion, setDescripcion] = useState(task.descripcion || '')

  const handleSave = () => {
    if (titulo.trim()) {
      onUpdate(task.id, { titulo, descripcion })
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">Editar tarea</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Título</label>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Agrega una descripción..."
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => { onDelete(task.id); onClose() }}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Eliminar tarea
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskModal