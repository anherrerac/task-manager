const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db/connection')

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la BD:', err)
  } else {
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0])
  }
})

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

