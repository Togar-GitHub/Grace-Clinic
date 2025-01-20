'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.User, {
        as: 'patient',
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      Appointment.belongsTo(models.User, {
        as: 'doctor',
        foreignKey: 'doctorId'
      })
      Appointment.hasOne(models.Chart, {
        foreignKey: 'appointmentId'
      })
    }
  }
  Appointment.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    complaint: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    insurance: DataTypes.STRING,
    dateMet: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};