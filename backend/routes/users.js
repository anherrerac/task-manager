const express = require('express')
const router = express.Router()
const pool = require('../db/connection')
const bcrypt = require('bcrypt')

// GET usuario por id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, created_at FROM users WHERE id=$1',
      [id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear usuario
router.post('/', async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await pool.query(
      'INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, created_at',
      [nombre, email, hashedPassword]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router