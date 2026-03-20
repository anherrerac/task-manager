import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Board from '../components/Board'
import api from '../services/api'

function Dashboard() {
  const { user, logout } = useAuth()
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await api.get(`/boards/user/${user.id}`)
      setBoards(response.data)
      if (response.data.length > 0) {
        setSelectedBoard(response.data[0].id)
      }
    } catch (err) {
      console.error('Error cargando boards:', err)
    }
  }

  const createBoard = async () => {
  const nombre = window.prompt('Nombre del board:')
  if (!nombre) return
  try {
    const response = await api.post('/boards', {
      nombre,
      descripcion: '',
      user_id: user.id
    })
    setBoards(prev => [...prev, response.data])
    setSelectedBoard(response.data.id)
  } catch (err) {
    console.error('Error creando board:', err)
  }
}

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Bienvenido, {user?.nombre}</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {boards.map(board => (
          <button
            key={board.id}
            onClick={() => setSelectedBoard(board.id)}
            style={{ fontWeight: selectedBoard === board.id ? 'bold' : 'normal' }}
          >
            {board.nombre}
          </button>
        ))}
        <button onClick={createBoard}>+ Nuevo board</button>
      </div>

      {selectedBoard && <Board boardId={selectedBoard} />}
    </div>
  )
}

export default Dashboard