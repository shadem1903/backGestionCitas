const Notificacion = require('../models/Notificacion');

exports.obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll({
            where: { usuarioId: req.usuario.id },
            order: [['fecha', 'DESC']]
        });
        res.json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener las notificaciones');
    }
};

exports.marcarLeida = async (req, res) => {
    try {
        const notificacion = await Notificacion.findByPk(req.params.id);
        if (!notificacion) {
            return res.status(404).json({ msg: 'Notificación no encontrada' });
        }

        if (notificacion.usuarioId !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        notificacion.leida = true;
        await notificacion.save();

        res.json(notificacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar la notificacion');
    }
};
