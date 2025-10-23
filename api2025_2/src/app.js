import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// importar las rutas
import clientesRoutes from './routes/clientes.routes.js'
import productosRoutes from './routes/producto.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import authRoutes from './routes/auth.routes.js'

// importar el middleware del token
import { verifyToken } from './middlewares/verifyToken.js'

// cargar variables de entorno (.env)
dotenv.config()

const app = express()
app.use(express.json())
const corsOption={
  origin:'*',
  methods:['GET','POST','PUT','PATCH','DELETE'],
  credentials: true
}
app.use(cors(corsOption));
// rutas públicas (sin token)
app.use('/api/auth', authRoutes)

// rutas protegidas (requieren token válido)
app.use('/api', verifyToken, clientesRoutes)
app.use('/api', verifyToken, productosRoutes)
app.use('/api', verifyToken, pedidosRoutes)

// manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  })
})

export default app
