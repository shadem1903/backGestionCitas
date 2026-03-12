const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, historialController.crearHistorial);
router.get('/paciente/:pacienteId', authMiddleware, historialController.obtenerHistorialPaciente);
router.get('/:id', authMiddleware, historialController.obtenerHistorial);

module.exports = router;
