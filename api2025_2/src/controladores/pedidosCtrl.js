import {conmysql} from '../db.js';

export const postPedido = async (req, res) => {
    try {
        const { cli_id, usr_id, ped_estado, detalles } = req.body;
        // detalles debe ser un array de objetos con { prod_id, det_cantidad, det_precio }

        // 1. Insertar pedido
        const [resultPedido] = await conmysql.query(
            `INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, NOW(), ?, ?)`,
            [cli_id, usr_id, ped_estado || 0]
        );

        const ped_id = resultPedido.insertId;

        // 2. Insertar detalles (puedes optimizar con un solo insert múltiple)
        const valuesDetalles = detalles.map(d => [d.prod_id, ped_id, d.det_cantidad, d.det_precio]);

        if(valuesDetalles.length > 0){
            await conmysql.query(
                `INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES ?`,
                [valuesDetalles]
            );
        }

        res.status(201).json({ ped_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar el pedido' });
    }
}

export const getPedidos = async (req, res) => {
    try {
        // Consulta que une pedidos con sus detalles
        const [rows] = await conmysql.query(
            `SELECT 
                p.ped_id, p.cli_id, p.ped_fecha, p.usr_id, p.ped_estado,
                d.det_id, d.prod_id, d.det_cantidad, d.det_precio
            FROM pedidos p
            LEFT JOIN pedidos_detalle d ON p.ped_id = d.ped_id
            ORDER BY p.ped_id`
        );

        // Agrupar pedidos y anidar detalles
        const pedidosMap = new Map();

        for (const row of rows) {
            if (!pedidosMap.has(row.ped_id)) {
                pedidosMap.set(row.ped_id, {
                    ped_id: row.ped_id,
                    cli_id: row.cli_id,
                    ped_fecha: row.ped_fecha,
                    usr_id: row.usr_id,
                    ped_estado: row.ped_estado,
                    detalles: []
                });
            }

            if (row.det_id) {
                pedidosMap.get(row.ped_id).detalles.push({
                    det_id: row.det_id,
                    prod_id: row.prod_id,
                    det_cantidad: row.det_cantidad,
                    det_precio: row.det_precio
                });
            }
        }

        const pedidosConDetalles = Array.from(pedidosMap.values());

        res.json(pedidosConDetalles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos con detalles' });
    }
};

export const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await conmysql.query(
            `SELECT 
                p.ped_id, p.cli_id, p.ped_fecha, p.usr_id, p.ped_estado,
                d.det_id, d.prod_id, d.det_cantidad, d.det_precio
            FROM pedidos p
            LEFT JOIN pedidos_detalle d ON p.ped_id = d.ped_id
            WHERE p.ped_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Armar el objeto pedido con detalles anidados
        const pedido = {
            ped_id: rows[0].ped_id,
            cli_id: rows[0].cli_id,
            ped_fecha: rows[0].ped_fecha,
            usr_id: rows[0].usr_id,
            ped_estado: rows[0].ped_estado,
            detalles: []
        };

        for (const row of rows) {
            if (row.det_id) {
                pedido.detalles.push({
                    det_id: row.det_id,
                    prod_id: row.prod_id,
                    det_cantidad: row.det_cantidad,
                    det_precio: row.det_precio
                });
            }
        }

        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al obtener el pedido' });
    }
};




/* 
// Obtener todos los pedidos (sin detalles, solo la info principal)
export const getPedidos = async (req, res) => {
    try {
        const [pedidos] = await conmysql.query(
            `SELECT ped_id, cli_id, ped_fecha, usr_id, ped_estado FROM pedidos`
        );
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

// Obtener un pedido por id junto con sus detalles
export const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener info del pedido
        const [pedidos] = await conmysql.query(
            `SELECT ped_id, cli_id, ped_fecha, usr_id, ped_estado FROM pedidos WHERE ped_id = ?`,
            [id]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const pedido = pedidos[0];

        // Obtener detalles del pedido
        const [detalles] = await conmysql.query(
            `SELECT det_id, prod_id, ped_id, det_cantidad, det_precio FROM pedidos_detalle WHERE ped_id = ?`,
            [id]
        );

        pedido.detalles = detalles;

        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al obtener el pedido' });
    }
};
 */