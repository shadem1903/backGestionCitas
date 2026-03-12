const amqp = require('amqplib');
const Notificacion = require('../models/Notificacion');

const connectRabbitMQConsumer = async (io) => {
    try {
        const amqpServer = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        await channel.assertQueue('citas_eventos');
        
        console.log('[Notificaciones Service] Conectado a RabbitMQ. Escuchando...');

        channel.consume('citas_eventos', async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log(`[Notificaciones Service] Evento recibido: ${message.event}`, message.data);

                // lógica simple de la notificación basada en el evento
                let titulo = 'Nueva Notificación';
                let cuerpo = 'Ha ocurrido un evento.';

                if (message.event === 'Cita Creada') {
                    titulo = 'Cita Agendada';
                    cuerpo = `Tu cita ha sido agendada para el ${message.data.fecha} a las ${message.data.hora}.`;
                } else if (message.event === 'Cita Cancelada') {
                    titulo = 'Cita Cancelada';
                    cuerpo = `La cita previamente programada ha sido cancelada.`;
                }

                // Guardar en la DB
                const nuevaNotificacion = await Notificacion.create({
                    usuarioId: message.data.pacienteId || 1, // Fallback si no viene usuario
                    titulo,
                    mensaje: cuerpo
                });

                // Si hay websocket conectado, notificar al frontend en tiempo real
                if (io) {
                    io.to(message.data.pacienteId.toString()).emit('nueva_notificacion', nuevaNotificacion);
                }

                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('[Notificaciones Service] Error al conectar con RabbitMQ Consumer', error);
    }
};

module.exports = {
    connectRabbitMQConsumer
};
