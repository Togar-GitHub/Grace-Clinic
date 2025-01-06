'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Charts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      complaint: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      meetingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      diagnosesICD10: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      diagnosesDesc: {
        type: Sequelize.STRING(2000),
        allowNull: false
      },
      CPTId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CPTs',
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      doctorNote: {
        type: Sequelize.STRING(2000),
        allowNull: false
      },
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        references: {
          model: 'Services',
          key: 'id'
        }
      },
      prescription: {
        type: Sequelize.STRING(200)
      },
      insurance: {
        type: Sequelize.STRING(100)
      },
      cost: {
        type: Sequelize.NUMERIC(6, 2)
      },
      nextAppointment: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Charts'
    await queryInterface.dropTable(options);
  }
};