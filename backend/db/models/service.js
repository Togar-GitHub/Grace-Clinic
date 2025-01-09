'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // define association here
      // Service.belongsToMany(models.Chart, {
      //   through: 'ChartServices',
      //   foreignKey: 'serviceId',
      //   otherKey: 'chartId',
      //   as: 'charts'
      // })
    }
  }
  Service.init({
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
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