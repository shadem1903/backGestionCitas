const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', require('./src/routes/usuarioRoutes'));
app.use('/', require('./src/routes/authRoutes'));

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[Usuarios Service] Conectado a PostgreSQL (usuarios_db)');
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`[Usuarios Service] Corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[Usuarios Service] Error al inicializar:', error);
    }
};

startServer();
