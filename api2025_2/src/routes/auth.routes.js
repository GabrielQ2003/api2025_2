import { Router } from 'express'
import { registerUsuario, loginUsuario } from '../controladores/authCtrl.js'

const router = Router()

router.post('/registerUsuario', registerUsuario)
router.post('/loginUsuario', loginUsuario)

export default router
