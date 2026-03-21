import { useState } from 'react'

function CreateTaskModal({ onClose, onCreate }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('todo')

  const handleCreate = () => {
    if (!titulo.trim()) return
    onCreate({ titulo, descripcion, estado })
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
          <h3 className="text-white font-semibold text-lg">Nueva tarea</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Título *</label>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Nombre de la tarea"
              className="bg-gray-700 text-white placeholder-gray-500 px-3 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Descripción opcional..."
              className="bg-gray-700 text-white placeholder-gray-500 px-3 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Por hacer</option>
              <option value="in_progress">En progreso</option>
              <option value="done">Hecho</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!titulo.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateTaskModal