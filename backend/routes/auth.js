const express = require('express')
const router = express.Router()
const pool = require('../db/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    // Buscar usuario por email
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const user = result.rows[0]

    // Verificar password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router