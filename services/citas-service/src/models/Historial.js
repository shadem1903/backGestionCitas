const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historial = sequelize.define('Historial', {
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  medicoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tratamiento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notasAdicionales: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Historial;