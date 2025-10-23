import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = (req, res, next) => {
  const header = req.headers['authorization']

  if (!header) return res.status(403).json({ message: 'Token no proporcionado' })

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // guarda los datos del usuario dentro del request
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
