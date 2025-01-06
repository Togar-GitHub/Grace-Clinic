'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsToMany(models.Chart, {
        through: 'ChartServices',
        foreignKey: 'serviceId',
        otherKey: 'chartId'
      })
    }
  }
  Service.init({
    service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};