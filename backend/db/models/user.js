'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Review, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      User.hasMany(models.Appointment, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      User.hasMany(models.Appointment, {
        foreignKey: 'doctorId'
      })
      User.hasMany(models.Chart, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE'
      })
      User.hasMany(models.Chart, {
        foreignKey: 'doctorId'
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30]
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['male', 'female']],  // Array of allowed values
          msg: 'Gender must be either male or female',  // Custom error message
        },
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: [4, 50],
      isNotEmail(value) {
        if (Validator.isEmail(value)) {
          throw new Error('Cannot be an email.');
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 256],
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 5]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10]
      }
    },
    allergy: DataTypes.STRING,
    dateInactive: DataTypes.DATE,
    staff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    position: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};