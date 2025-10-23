import {Router} from 'express';

import {postPedido, getPedidos, getPedidoById} from '../controladores/pedidosCtrl.js';

const router=Router();

router.post('/pedidos',postPedido);
router.get('/pedidos',getPedidos);
router.get('/pedidos/:id',getPedidoById);


export default router;