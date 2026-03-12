const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = async (req, res, next) => {
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No se encontro el token, autorización denegada' });
    }

    const token = tokenHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const usuario = await Usuario.findByPk(decoded.id, { attributes: ['id', 'email', 'rol'] });

        if (!usuario) {
            return res.status(401).json({ msg: 'Usuario no encontrado, autorización denegada' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(500).json({ msg: 'Error al verificar usuario en el middleware' });
    }
};
