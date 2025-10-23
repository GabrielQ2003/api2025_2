import {Router} from 'express'
//importar las funciones
import { prueba, getClientes, getClientesxId, postCliente, putCliente,deleteCliente} from '../controladores/clientesCtrl.js';


const router=Router();
//armar nuestras rutas 
//router.get('/clientes',prueba)
router.get('/clientes',getClientes)
router.get('/clientes/:id',getClientesxId)
router.post('/clientes',postCliente)
router.put('/clientes/:id',putCliente)
router.delete('/clientes/:id',deleteCliente)

export default router
