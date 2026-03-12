const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', especialidadController.obtenerEspecialidades);
router.get('/:id', especialidadController.obtenerEspecialidad);
router.post('/', authMiddleware, especialidadController.crearEspecialidad);
router.delete('/:id', authMiddleware, especialidadController.eliminarEspecialidad);

module.exports = router;
