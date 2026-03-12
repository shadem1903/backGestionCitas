const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');
const { connectRabbitMQConsumer } = require('./src/events/consumer');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', require('./src/routes/notificacionRoutes'));

const PORT = process.env.PORT || 3004;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[Notificaciones Service] Conectado a PostgreSQL (notificaciones_db)');
        await sequelize.sync();

        const server = require('http').createServer(app);

        // Inicializar WebSocket Server
        const { iniciarWSServer } = require('./src/websockets/notificacionesWS');
        const io = iniciarWSServer(server);

        // Conectar Consumer a RabbitMQ pasándole Socket.io
        // Esperamos unos segundos para que RabbitMQ inicie correctamente en Docker
        setTimeout(async () => {
             await connectRabbitMQConsumer(io);
        }, 5000);

        server.listen(PORT, () => {
            console.log(`[Notificaciones Service] Corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[Notificaciones Service] Error al inicializar:', error);
    }
};

startServer();
