const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disponibilidad = sequelize.define('Disponibilidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    medicoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('disponible', 'ocupado', 'cancelado'),
        defaultValue: 'disponible'
    }
}, {
    timestamps: true,
    tableName: 'disponibilidades'
});

module.exports = Disponibilidad;
