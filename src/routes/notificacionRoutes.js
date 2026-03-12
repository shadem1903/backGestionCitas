const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, notificacionController.obtenerNotificaciones);
router.put('/:id/read', authMiddleware, notificacionController.marcarLeida);

module.exports = router;
