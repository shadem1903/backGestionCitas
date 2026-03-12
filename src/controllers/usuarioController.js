const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener usuarios');
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { email } = req.body;
        let usuario = await Usuario.findOne({ where: { email } });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        usuario = await Usuario.create(req.body);

        const usuarioRes = usuario.toJSON();
        delete usuarioRes.password;

        res.status(201).json(usuarioRes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al crear el usuario');
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await usuario.update(req.body);
        const usuarioRes = usuario.toJSON();
        delete usuarioRes.password;

        res.json(usuarioRes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar');
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar');
    }
};
