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
      Chart.belongsToMany(models.Service, {
        through: 'ChartServices',
        foreignKey: 'chartId',
        otherKey: 'serviceId'
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
        len: [4, 2000]
      }
    },
    meetingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    diagnosesICD10: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    diagnosesDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 2000]
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
    services: DataTypes.ARRAY(DataTypes.STRING),
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