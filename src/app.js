const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Bases de datos y brokers
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/disponibilidad', require('./routes/disponibilidadRoutes'));
app.use('/api/citas', require('./routes/citaRoutes'));
app.use('/api/especialidades', require('./routes/especialidadRoutes'));
app.use('/api/historial', require('./routes/historialRoutes'));
app.use('/api/notificaciones', require('./routes/notificacionRoutes'));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL conectado exitosamente');
        await sequelize.sync();

        const server = require('http').createServer(app);

        // Inicializar WebSocket Server
        const { iniciarWSServer } = require('./websockets/notificacionesWS');
        iniciarWSServer(server);

        server.listen(PORT, () => {
            console.log(`Backend corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al inicializar los servicios:', error);
    }
};

startServer();
