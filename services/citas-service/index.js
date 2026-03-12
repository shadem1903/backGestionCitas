const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');
const { connectRabbitMQ } = require('./src/events/producer');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', require('./src/routes/citaRoutes'));
app.use('/', require('./src/routes/historialRoutes'));

const PORT = process.env.PORT || 3003;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[Citas Service] Conectado a PostgreSQL (citas_db)');
        await sequelize.sync();

        // Conectar al Broker
        await connectRabbitMQ();

        app.listen(PORT, () => {
            console.log(`[Citas Service] Corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[Citas Service] Error al inicializar:', error);
    }
};

startServer();
