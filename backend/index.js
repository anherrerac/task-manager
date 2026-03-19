const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db/connection')
const tasksRoutes = require('./routes/tasks')
const boardsRoutes = require('./routes/boards')
const usersRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/tasks', tasksRoutes)
app.use('/api/boards', boardsRoutes)
app.use('/api/users', usersRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando' })
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la BD:', err)
  } else {
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0])
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})