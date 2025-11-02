import express from 'express';
import { getDBEngine } from '../config/database.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Importar controladores según el motor de BD
const dbEngine = getDBEngine();
let authController;

if (dbEngine === 'mongo') {
    authController = await import('../controllers/mongo/authController.js');
} else {
    authController = await import('../controllers/postgres/authController.js');
}

const { registro, login, perfil } = authController;

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.get('/perfil', verificarToken, perfil);

export default router;