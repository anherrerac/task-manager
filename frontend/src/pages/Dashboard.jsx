import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Board from '../components/Board'
import CreateBoardModal from '../components/CreateBoardModal'
import api from '../services/api'

function Dashboard() {
  const { user, logout } = useAuth()
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(
    localStorage.getItem('selectedBoard')
      ? parseInt(localStorage.getItem('selectedBoard'))
      : null
  )
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)

  const handleSelectBoard = (id) => {
    setSelectedBoard(id)
    localStorage.setItem('selectedBoard', id)
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await api.get(`/boards/user/${user.id}`)
      setBoards(response.data)
      if (response.data.length > 0) {
        const saved = localStorage.getItem('selectedBoard')
        const savedId = saved ? parseInt(saved) : null
        const exists = response.data.find(b => b.id === savedId)
        handleSelectBoard(exists ? savedId : response.data[0].id)
      }
    } catch (err) {
      console.error('Error cargando boards:', err)
    }
  }

  const handleCreateBoard = async (nombre) => {
    try {
      const response = await api.post('/boards', {
        nombre,
        descripcion: '',
        user_id: user.id
      })
      setBoards(prev => [...prev, response.data])
      handleSelectBoard(response.data.id)
    } catch (err) {
      console.error('Error creando board:', err)
    }
  }

  const deleteBoard = async (id) => {
    if (!window.confirm('¿Eliminar este board y todas sus tareas?')) return
    try {
      await api.delete(`/boards/${id}`)
      const remaining = boards.filter(b => b.id !== id)
      setBoards(remaining)
      handleSelectBoard(remaining.length > 0 ? remaining[0].id : null)
    } catch (err) {
      console.error('Error eliminando board:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hola, {user?.nombre}</span>
          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-700 bg-gray-800">
        {boards.map(board => (
          <div
            key={board.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedBoard === board.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span onClick={() => handleSelectBoard(board.id)} className="cursor-pointer">
              {board.nombre}
            </span>
            <button
              onClick={() => deleteBoard(board.id)}
              className="hover:text-red-400 transition-colors text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowCreateBoardModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-dashed border-gray-500"
        >
          + Nuevo board
        </button>
      </div>

      <div className="p-6">
        {selectedBoard
          ? <Board boardId={selectedBoard} />
          : <p className="text-gray-400 text-center mt-12">Crea un board para comenzar</p>
        }
      </div>

      {showCreateBoardModal && (
        <CreateBoardModal
          onClose={() => setShowCreateBoardModal(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  )
}

export default Dashboard