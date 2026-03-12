const Cita = require('../models/Cita');
const Historial = require('../models/Historial');
const sequelize = require('../config/database');
const { publishEvent } = require('../events/producer');
const axios = require('axios'); // Para consultar el MS de Disponibilidad

exports.crearCita = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { pacienteId, medicoId, fecha, hora, disponibilidadId } = req.body;

        // 1. Verificar Disponibilidad comunicándose con el servicio de disponibilidad
        try {
            // El API Gateway enruta /api/disponibilidad al puerto 3002
            // Aquí lo hacemos directo al servicio para ser resilientes si el gateway falla
            const response = await axios.get(`http://localhost:3002/${disponibilidadId}`);
            const disponibilidad = response.data;
            if (!disponibilidad || disponibilidad.estado !== 'disponible') {
                await t.rollback();
                return res.status(400).json({ msg: 'Horario no disponible' });
            }
        } catch (error) {
            await t.rollback();
            return res.status(400).json({ msg: 'Error al verificar disponibilidad o no existe' });
        }

        // 2. Crear cita Localmente
        const nuevaCita = await Cita.create({
            pacienteId,
            medicoId,
            fecha,
            hora,
            estado: 'programada'
        }, { transaction: t });

        // 3. Actualizar estado en el otro microservicio
        try {
            await axios.put(`http://localhost:3002/${disponibilidadId}`, { estado: 'ocupado' }, {
                // Pasamos un header ficticio si el middleware lo exige o lo removemos del ms de disp.
                headers: { 'x-user-id': req.usuario ? req.usuario.id : 1 } 
            });
        } catch (error) {
            await t.rollback();
            console.error('Error actualizando disponibilidad remota', error);
            return res.status(500).json({ msg: 'No se pudo actualizar disponibilidad' });
        }

        await t.commit();
        
        // 4. Emitir evento a RabbitMQ
        publishEvent('Cita Creada', nuevaCita);

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
            try {
                await axios.put(`http://localhost:3002/${disponibilidadId}`, { estado: 'disponible' }, {
                     headers: { 'x-user-id': req.usuario ? req.usuario.id : 1 }
                });
            } catch (error) {
                  // Fallo silencioso o reintento idealmente. Para simplificar solo logueamos.
                  console.error('Error liberando disponibilidad remota', error);
            }
        }

        await t.commit();
        publishEvent('Cita Cancelada', cita);

        res.json({ msg: 'Cita cancelada correctamente' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Error al cancelar');
    }
};
