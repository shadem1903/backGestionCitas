const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
    try {
        const amqpServer = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
        const connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue('citas_eventos');
        console.log('[Citas Service] Conectado a RabbitMQ');
    } catch (error) {
        console.error('[Citas Service] Error al conectar con RabbitMQ', error);
    }
};

const publishEvent = (event, data) => {
    if (!channel) {
        console.error('[Citas Service] No hay canal de RabbitMQ disponible');
        return;
    }
    const message = { event, data, timestamp: new Date() };
    channel.sendToQueue('citas_eventos', Buffer.from(JSON.stringify(message)));
    console.log(`[Citas Service] Evento publicado: ${event}`);
};

module.exports = {
    connectRabbitMQ,
    publishEvent
};
