import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET: Consultar todos los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM productos'
        );

        res.status(200).json({
            status: 'success',
            total_registros: rows.length,
            data: rows
        });

    } catch (error) {
        console.error('Error en GET /productos:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

// POST: Registrar un producto nuevo
router.post('/', async (req, res) => {
    try {
        const {
            id_categoria,
            nombre_producto,
            precio_unitario,
            costo_proveedor,
            ubicacion_pasillo
        } = req.body;

        // Validar los datos recibidos
        if (
            id_categoria == null ||
            !nombre_producto ||
            precio_unitario == null ||
            costo_proveedor == null ||
            !ubicacion_pasillo
        ) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'Todos los parámetros son obligatorios'
            });
        }

        // Insertar el producto en MySQL
        await pool.query(
            `INSERT INTO productos (
                id_categoria,
                nombre_producto,
                precio_unitario,
                costo_proveedor,
                ubicacion_pasillo
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                id_categoria,
                nombre_producto,
                precio_unitario,
                costo_proveedor,
                ubicacion_pasillo
            ]
        );

        res.status(201).json({
            status: 'created',
            message: 'Producto registrado exitosamente',
            datos_registrados: {
                id_categoria,
                nombre_producto,
                precio_unitario,
                costo_proveedor,
                ubicacion_pasillo
            }
        });

    } catch (error) {
        console.error('Error en POST /productos:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

export default router;