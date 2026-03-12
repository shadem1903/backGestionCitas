const Disponibilidad = require('../models/Disponibilidad');

exports.crearDisponibilidad = async (req, res) => {
    try {
        const { medicoId, fecha, horaInicio, horaFin } = req.body;

        const nuevaDisp = await Disponibilidad.create({
            medicoId,
            fecha,
            horaInicio,
            horaFin
        });

        res.status(201).json(nuevaDisp);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al crear la disponibilidad');
    }
};

exports.obtenerDisponibilidades = async (req, res) => {
    try {
        const { medicoId, fecha } = req.query;
        const filter = {};
        if (medicoId) filter.medicoId = medicoId;
        if (fecha) filter.fecha = fecha;

        const disponibilidades = await Disponibilidad.findAll({ where: filter });
        res.json(disponibilidades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const disponibilidad = await Disponibilidad.findByPk(id);
        if (!disponibilidad) {
            return res.status(404).json({ msg: 'Disponibilidad no encontrada' });
        }

        disponibilidad.estado = estado;
        await disponibilidad.save();

        res.json(disponibilidad);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};
