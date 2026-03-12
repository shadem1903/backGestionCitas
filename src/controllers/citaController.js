const Cita = require('../models/Cita');
const Disponibilidad = require('../models/Disponibilidad');
const sequelize = require('../config/database');

exports.crearCita = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { pacienteId, medicoId, fecha, hora, disponibilidadId } = req.body;

        // 1. Verificar Disponibilidad Localmente (al estar en el mismo monolito)
        const disponibilidad = await Disponibilidad.findByPk(disponibilidadId, { transaction: t });

        if (!disponibilidad || disponibilidad.estado !== 'disponible') {
            await t.rollback();
            return res.status(400).json({ msg: 'Horario no disponible' });
        }

        // 2. Crear cita
        const nuevaCita = await Cita.create({
            pacienteId,
            medicoId,
            fecha,
            hora,
            estado: 'programada'
        }, { transaction: t });

        // 3. Actualizar estado
        disponibilidad.estado = 'ocupado';
        await disponibilidad.save({ transaction: t });

        await t.commit();
        res.status(201).json(nuevaCita);
    } catch (error) {
        await t.rollback();
        console.error('Error en transaccion de cita:', error.message);
        res.status(500).json({ msg: 'Hubo un error al reservar la cita. Transacción revertida.' });
    }
};

exports.obtenerCitasPaciente = async (req, res) => {
    try {
        const citas = await Cita.findAll({ where: { pacienteId: req.usuario.id } });
        res.json(citas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.cancelarCita = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { disponibilidadId } = req.body;

        const cita = await Cita.findByPk(id, { transaction: t });
        if (!cita) {
            await t.rollback();
            return res.status(404).json({ msg: 'Cita no encontrada' });
        }

        cita.estado = 'cancelada';
        await cita.save({ transaction: t });

        if (disponibilidadId) {
            const disponibilidad = await Disponibilidad.findByPk(disponibilidadId, { transaction: t });
            if (disponibilidad) {
                disponibilidad.estado = 'disponible';
                await disponibilidad.save({ transaction: t });
            }
        }

        await t.commit();
        res.json({ msg: 'Cita cancelada correctamente' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Error al cancelar');
    }
};
