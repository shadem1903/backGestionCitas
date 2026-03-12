const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', usuarioController.crearUsuario);
router.get('/', authMiddleware, usuarioController.obtenerUsuarios);
router.get('/:id', authMiddleware, usuarioController.obtenerUsuario);
router.put('/:id', authMiddleware, usuarioController.actualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.eliminarUsuario);

module.exports = router;
