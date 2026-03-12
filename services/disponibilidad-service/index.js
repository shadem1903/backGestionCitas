const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', require('./src/routes/disponibilidadRoutes'));
app.use('/', require('./src/routes/especialidadRoutes'));

const PORT = process.env.PORT || 3002;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[Disponibilidad Service] Conectado a PostgreSQL (disponibilidad_db)');
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`[Disponibilidad Service] Corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[Disponibilidad Service] Error al inicializar:', error);
    }
};

startServer();
