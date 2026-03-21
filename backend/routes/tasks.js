const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

const verifyToken = require('../middleware/auth')

// GET todas las tareas de un board
router.get('/board/:boardId', verifyToken, async (req, res) => {
  const { boardId } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE board_id = $1 ORDER BY orden ASC',
      [boardId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear tarea
router.post('/', async (req, res) => {
  const { titulo, descripcion, board_id, user_id, estado } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO tasks (titulo, descripcion, board_id, user_id, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, descripcion, board_id, user_id, estado || 'todo']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar tarea
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { titulo, descripcion, estado } = req.body
  try {
    const result = await pool.query(
      'UPDATE tasks SET titulo=$1, descripcion=$2, estado=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [titulo, descripcion, estado, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE borrar tarea
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM tasks WHERE id=$1', [id])
    res.json({ message: 'Tarea eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router