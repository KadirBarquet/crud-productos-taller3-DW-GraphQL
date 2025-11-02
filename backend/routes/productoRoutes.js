import express from 'express';
import { getDBEngine } from '../config/database.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Importar controladores según el motor de BD
const dbEngine = getDBEngine();
let productoController;

if (dbEngine === 'mongo') {
    productoController = await import('../controllers/mongo/productoController.js');
} else {
    productoController = await import('../controllers/postgres/productoController.js');
}

const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} = productoController;

// Todas las rutas requieren autenticación
router.use(verificarToken);

// CRUD
router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;