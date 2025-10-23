import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { conmysql } from '../db.js'
import dotenv from 'dotenv'

dotenv.config()

// Registrar usuario
export const registerUsuario = async (req, res) => {
  try {
    const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body

    // encriptar clave
    const hashedPassword = await bcrypt.hash(usr_clave, 10)

    const [result] = await conmysql.query(
      'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)',
      [usr_usuario, hashedPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
    )

    res.json({ message: 'Usuario registrado correctamente', usr_id: result.insertId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' })
  }
}

// Iniciar sesión
export const loginUsuario = async (req, res) => {
  try {
    const { usr_usuario, usr_clave } = req.body

    const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usr_usuario])

    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' })

    const usuario = rows[0]

    // comparar clave
    const validPass = await bcrypt.compare(usr_clave, usuario.usr_clave)
    if (!validPass) return res.status(401).json({ message: 'Clave incorrecta' })

    // generar token
    const token = jwt.sign(
      { id: usuario.usr_id, usuario: usuario.usr_usuario, correo: usuario.usr_correo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    )

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: usuario.usr_id,
        nombre: usuario.usr_nombre,
        correo: usuario.usr_correo,
        activo: usuario.usr_activo
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' })
  }
}
