'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chart extends Model {
    static associate(models) {
      // define association here
      Chart.belongsTo(models.User, {
        as: 'patient',
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      Chart.belongsTo(models.User, {
        as: 'doctor',
        foreignKey: 'doctorId'
      })
      Chart.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId'
      })
      Chart.belongsTo(models.CPT, {
        foreignKey: 'CPTId'
      })
      // Chart.belongsToMany(models.Service, {
      //   through: 'ChartServices',
      //   foreignKey: 'chartId',
      //   otherKey: 'serviceId',
      //   as: 'services'
      // })
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
        len: [2, 200]
      }
    },
    meetingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    diagnosesICD10: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diagnosesDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
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
        len: [2, 100]
      }
    },
    doctorNote: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 2000]
      }
    },
    services: DataTypes.JSONB,     // this is for Sequelize - development
    // services: DataTypes.ARRAY(DataTypes.INTEGER),    // this is for postgreSQL - production
    prescription: DataTypes.STRING,
    insurance: DataTypes.STRING,
    cost: DataTypes.NUMERIC,        // this is for postgreSQL
    nextAppointment: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Chart',
  });
  return Chart;
};