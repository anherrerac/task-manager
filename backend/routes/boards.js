const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

const verifyToken = require('../middleware/auth')

// GET todos los boards de un usuario
router.get('/user/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear board
router.post('/', verifyToken, async (req, res) => {
  const { nombre, descripcion, user_id } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO boards (nombre, descripcion, user_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, user_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar board
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body
  try {
    const result = await pool.query(
      'UPDATE boards SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *',
      [nombre, descripcion, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE borrar board
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM boards WHERE id=$1', [id])
    res.json({ message: 'Board eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router