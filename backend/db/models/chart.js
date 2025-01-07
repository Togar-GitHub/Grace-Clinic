'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chart extends Model {
    static associate(models) {
      // define association here
      Chart.belongsTo(models.User, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      Chart.belongsTo(models.User, {
        foreignKey: 'doctorId'
      })
      Chart.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        onDelete: 'CASCADE'
      })
      Chart.belongsTo(models.CPT, {
        foreignKey: 'CPTId'
      })
    }
  }
  Chart.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    complaint: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 200]
      }
    },
    meetingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    diagnosesICD10: {
      // type: DataTypes.JSON,     // this is for Sequelite - development
      type: DataTypes.ARRAY(DataTypes.STRING),    // this is for postgreSQL - production
      allowNull: false
    },
    diagnosesDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 200]
      }
    },
    CPTId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 100]
      }
    },
    doctorNote: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 2000]
      }
    },
    // services: DataTypes.JSON,     // this is for Sequelite - development
    services: DataTypes.ARRAY(DataTypes.INTEGER),    // this is for postgreSQL - production
    prescription: DataTypes.STRING,
    insurance: DataTypes.STRING,
    cost: DataTypes.DECIMAL,
    nextAppointment: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Chart',
  });
  return Chart;
};