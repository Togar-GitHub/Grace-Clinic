'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chart.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    appointmentId: DataTypes.INTEGER,
    meetingDate: DataTypes.DATE,
    diagnosesICD10: DataTypes.JSON,
    diagnosesDesc: DataTypes.STRING,
    CPTCode: DataTypes.STRING,
    CPTPrice: DataTypes.DECIMAL,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    servicesAndPrice: DataTypes.JSONB,
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