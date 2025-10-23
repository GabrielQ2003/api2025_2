import { Router } from 'express'
// importar las funciones del controlador
import { 
    pruebaProducto, 
    getProductos, 
    getProductoById, 
    postProducto, 
    putProducto, 
    deleteProducto 
} from '../controladores/productoCtrl.js'
import upload from '../middlewares/upload.js';
const router = Router()

// armar nuestras rutas
// router.get('/productos', pruebaProducto)
router.get('/productos', getProductos)
router.get('/productos/:id', getProductoById)
//router.post('/productos', postProducto)
router.post('/productos', upload.single('imagen'), postProducto)
//router.put('/productos/:id', putProducto)
router.put('/productos/:id',upload.single('imagen'), putProducto)
router.delete('/productos/:id', deleteProducto)

export default router
