const Especialidad = require('../models/Especialidad');

exports.obtenerEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll();
        res.json(especialidades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener especialidades');
    }
};

exports.obtenerEspecialidad = async (req, res) => {
    try {
        const especialidad = await Especialidad.findByPk(req.params.id);
        if (!especialidad) {
            return res.status(404).json({ msg: 'Especialidad no encontrada' });
        }
        res.json(especialidad);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.crearEspecialidad = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        let especialidad = await Especialidad.findOne({ where: { nombre } });

        if (especialidad) {
            return res.status(400).json({ msg: 'La especialidad ya existe' });
        }

        especialidad = await Especialidad.create(req.body);
        res.status(201).json(especialidad);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al crear la especialidad');
    }
};

exports.eliminarEspecialidad = async (req, res) => {
    try {
        const especialidad = await Especialidad.findByPk(req.params.id);
        if (!especialidad) {
            return res.status(404).json({ msg: 'Especialidad no encontrada' });
        }

        await especialidad.destroy();
        res.json({ msg: 'Especialidad eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar');
    }
};
