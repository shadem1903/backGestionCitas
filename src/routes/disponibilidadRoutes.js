const express = require('express');
const router = express.Router();
const disponibilidadController = require('../controllers/disponibilidadController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, disponibilidadController.crearDisponibilidad);
router.get('/', authMiddleware, disponibilidadController.obtenerDisponibilidades);
router.put('/:id/estado', authMiddleware, disponibilidadController.actualizarEstado);

module.exports = router;
