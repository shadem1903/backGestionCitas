const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, citaController.crearCita);
router.get('/mis-citas', authMiddleware, citaController.obtenerCitasPaciente);
router.put('/:id/cancelar', authMiddleware, citaController.cancelarCita);

module.exports = router;
