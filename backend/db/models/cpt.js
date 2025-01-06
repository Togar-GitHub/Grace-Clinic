'use strict';

const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CPT extends Model {
    static associate(models) {
      // define association here
    }
  }
  CPT.init({
    CPTCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 5]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 1000]
      }
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CPT',
  });
  return CPT;
};