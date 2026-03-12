const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Nota: http-proxy-middleware a veces requiere que express.json() NO se use globalmente 
// antes del proxy si el proxy debe pasar el body completo. Lo omitimos aquí para los proxys,
// o aplicamos express.json() solo a rutas locales del gateway si las hubiera.

// Middleware simple de autenticación (basado en el README original)
const authMiddleware = (req, res, next) => {
    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/api/auth/login', '/api/usuarios/registro'];
    if (publicPaths.some(p => req.path.startsWith(p))) {
        return next();
    }

    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ mensaje: 'No autorizado. Se requiere X-User-Id en el header' });
    }
    next();
};

app.use(authMiddleware);

// Ruteo a los microservicios
app.use('/api/usuarios', createProxyMiddleware({ 
    target: 'http://localhost:3001', 
    changeOrigin: true 
}));

app.use('/api/auth', createProxyMiddleware({ 
    target: 'http://localhost:3001', 
    changeOrigin: true 
}));

app.use('/api/disponibilidad', createProxyMiddleware({ 
    target: 'http://localhost:3002', 
    changeOrigin: true 
}));

app.use('/api/citas', createProxyMiddleware({ 
    target: 'http://localhost:3003', 
    changeOrigin: true 
}));

// Asumimos que historial está ligado a pacientes/citas
app.use('/api/historial', createProxyMiddleware({ 
    target: 'http://localhost:3003', // Lo enrutamos a citas por ahora, o crear microservicio de historial
    changeOrigin: true 
}));

app.use('/api/notificaciones', createProxyMiddleware({ 
    target: 'http://localhost:3004', 
    changeOrigin: true 
}));

app.listen(PORT, () => {
    console.log(`[API Gateway] Corriendo en el puerto ${PORT}`);
    console.log(`-> Enrutando /api/usuarios y /api/auth a http://localhost:3001`);
    console.log(`-> Enrutando /api/disponibilidad a http://localhost:3002`);
    console.log(`-> Enrutando /api/citas y /api/historial a http://localhost:3003`);
    console.log(`-> Enrutando /api/notificaciones a http://localhost:3004`);
});
