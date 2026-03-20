import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h2>Bienvenido, {user?.nombre}</h2>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}

export default Dashboard