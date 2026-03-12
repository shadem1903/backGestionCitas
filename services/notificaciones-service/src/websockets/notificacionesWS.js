const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// Mapa para guardar las conexiones activas por usuarioId
const clientesConectados = new Map();

const iniciarWSServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        // Extraer el token de la URL: ws://localhost:3000/?token=XYZ
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const token = urlParams.searchParams.get('token');

        if (!token) {
            ws.send(JSON.stringify({ error: 'No autorizado. Token no proporcionado.' }));
            return ws.close();
        }

        try {
            // Verificar JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            const usuarioId = decoded.id;

            // Guardar o actualizar la conexión del usuario
            if (!clientesConectados.has(usuarioId)) {
                clientesConectados.set(usuarioId, new Set());
            }
            clientesConectados.get(usuarioId).add(ws);

            console.log(`Usuario conectado por WS: ${usuarioId}`);

            ws.send(JSON.stringify({ msg: 'Conectado exitosamente a las notificaciones' }));

            ws.on('close', () => {
                const conexionesUsuario = clientesConectados.get(usuarioId);
                if (conexionesUsuario) {
                    conexionesUsuario.delete(ws);
                    if (conexionesUsuario.size === 0) {
                        clientesConectados.delete(usuarioId);
                    }
                }
                console.log(`Usuario desconectado de WS: ${usuarioId}`);
            });

        } catch (error) {
            ws.send(JSON.stringify({ error: 'Token inválido o expirado.' }));
            ws.close();
        }
    });

    return wss;
};

// Función para enviar notificaciones en tiempo real
const enviarNotificacionWS = (usuarioId, notificacion) => {
    const conexionesUsuario = clientesConectados.get(usuarioId);
    if (conexionesUsuario) {
        conexionesUsuario.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(notificacion));
            }
        });
    }
};

module.exports = {
    iniciarWSServer,
    enviarNotificacionWS
};
