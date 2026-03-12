const Historial = require('../models/Historial');
const Notificacion = require('../models/Notificacion');

exports.crearHistorial = async (req, res) => {
    try {
        const nuevoHistorial = await Historial.create(req.body);

        // Crear notificación sincrónicamente en PostgreSQL
        const notificacion = await Notificacion.create({
            usuarioId: req.body.pacienteId,
            mensaje: `El Dr. con ID ${req.body.medicoId} ha actualizado tu historial médico.`,
            tipo: 'push'
        });

        // Emitir evento por WebSocket
        const { enviarNotificacionWS } = require('../websockets/notificacionesWS');
        enviarNotificacionWS(req.body.pacienteId, notificacion);

        res.status(201).json(nuevoHistorial);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al crear historia clínica');
    }
};

exports.obtenerHistorialPaciente = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const historiales = await Historial.findAll({
            where: { pacienteId },
            order: [['fecha', 'DESC']]
        });
        res.json(historiales);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al buscar historial');
    }
};

exports.obtenerHistorial = async (req, res) => {
    try {
        const historial = await Historial.findByPk(req.params.id);
        if (!historial) {
            return res.status(404).json({ msg: 'Historial no encontrado' });
        }
        res.json(historial);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al buscar el historial');
    }
};
