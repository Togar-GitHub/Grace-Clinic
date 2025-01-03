'use strict';
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
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER
      },
      meetingDate: {
        type: Sequelize.DATE
      },
      diagnosesICD10: {
        type: Sequelize.JSON
      },
      diagnosesDesc: {
        type: Sequelize.STRING
      },
      CPTCode: {
        type: Sequelize.STRING
      },
      CPTPrice: {
        type: Sequelize.DECIMAL
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      servicesAndPrice: {
        type: Sequelize.JSONB
      },
      prescription: {
        type: Sequelize.STRING
      },
      insurance: {
        type: Sequelize.STRING
      },
      cost: {
        type: Sequelize.DECIMAL
      },
      nextAppointment: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Charts');
  }
};