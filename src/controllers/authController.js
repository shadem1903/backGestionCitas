const Usuario = require('../models/Usuario');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
    return res.status(400).json({
      message: "Email y password son obligatorios"
    })
  }

  const usuario = await Usuario.findOne({
    where: { email }
  })

  if (!usuario) {
    return res.status(404).json({
      message: "Usuario no encontrado"
    })
  }

        const passwordValido = await usuario.validarPassword(password);
        if (!passwordValido) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const jwt = require('jsonwebtoken');

        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '8h' });

        res.json({ msg: 'Login exitoso', token, usuario: payload });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error de servidor en login');
    }
};

exports.logout = async (req, res) => {
    // Al usar cabeceras directas en vez de sesiones o JWT, el logout
    // es simplemente olvidarse del ID en el cliente.
    res.json({ msg: 'Logout exitoso' });
};

exports.validarToken = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No hay token, autorización denegada' });

    try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secret_key');
        const usuario = await Usuario.findByPk(decoded.id, { attributes: ['id', 'email', 'rol'] });
        if (!usuario) {
            return res.status(401).json({ msg: 'Usuario no encontrado' });
        }

        res.json({ valido: true, usuario });
    } catch (error) {
        res.status(500).json({ msg: 'Error validando usuario' });
    }
};
