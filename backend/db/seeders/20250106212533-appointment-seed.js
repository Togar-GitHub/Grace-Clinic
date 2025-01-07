'use strict';

const { Appointment } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const appointmentSeeds = [
  {
    // id: 1,   // all id only for development
    patientId: 6,  // Patient 1
    doctorId: 2,   // Doctor 1
    dateTime: new Date('2024-12-01T10:00:00Z'), // Past appointment
    complaint: 'Severe headache',
    insurance: 'Aetna',
    dateMet: new Date('2024-12-01T10:30:00Z')
  },
  {
    // id: 2,
    patientId: 6,  // Patient 1
    doctorId: 2,   // Doctor 1
    dateTime: new Date('2023-09-15T10:00:00Z'), // Past appointment
    complaint: 'Severe headache',
    insurance: 'United Healthcare',
    dateMet: null
  },
  {
    // id: 3,
    patientId: 6,  // Patient 1
    doctorId: 2,   // Doctor 2
    dateTime: new Date('2025-01-15T14:00:00Z'), // Future appointment
    complaint: 'Back pain',
    insurance: null,
    dateMet: null
  },
  {
    // id: 4,
    patientId: 7,  // Patient 2
    doctorId: 5,   // Doctor 2
    dateTime: new Date('2024-11-25T11:00:00Z'), // Past appointment
    complaint: 'Cough and cold',
    insurance: 'Cigna',
    dateMet: new Date('2024-11-25T11:30:00Z')
  },
  {
    // id: 5,
    patientId: 7,  // Patient 2
    doctorId: 5,   // Doctor 2
    dateTime: new Date('2024-06-20T14:30:00Z'), // Past appointment
    complaint: 'Headache',
    insurance: 'Cigna',
    dateMet: null
  },
  {
    // id: 6,
    patientId: 7,  // Patient 2
    doctorId: 5,   // Doctor 2
    dateTime: new Date('2025-02-05T09:00:00Z'), // Future appointment
    complaint: 'Rash on skin',
    insurance: null,
    dateMet: null
  },
  {
    // id: 7,
    patientId: 8,  // Patient 3
    doctorId: 5,   // Doctor 2
    dateTime: new Date('2024-10-10T15:00:00Z'), // Past appointment
    complaint: 'Knee pain',
    insurance: 'Aetna',
    dateMet: new Date('2024-10-10T15:30:00Z')
  },
  {
    // id: 8,
    patientId: 8,  // Patient 3
    doctorId: 5,   // Doctor 2
    dateTime: new Date('2025-03-20T08:30:00Z'), // Future appointment
    complaint: 'Fatigue',
    insurance: 'Blue Cross',
    dateMet: null
  },
  {
    // id: 9,
    patientId: 9,  // Patient 4
    doctorId: 2,   // Doctor 1
    dateTime: new Date('2024-12-10T13:30:00Z'), // Past appointment
    complaint: 'Stomach ache',
    insurance: 'Cigna',
    dateMet: new Date('2024-12-10T14:00:00Z')
  },
  {
    // id: 10,
    patientId: 9,  // Patient 4
    doctorId: 2,   // Doctor 2
    dateTime: new Date('2025-04-01T10:00:00Z'), // Future appointment
    complaint: 'Chest pain',
    insurance: 'United Healthcare',
    dateMet: null
  },
  {
    // id: 11,
    patientId: 10,  // Patient 5
    doctorId: 2,   // Doctor 1
    dateTime: new Date('2024-11-01T12:00:00Z'), // Past appointment
    complaint: 'Sore throat',
    insurance: 'Aetna',
    dateMet: new Date('2024-11-01T12:30:00Z')
  },
  {
    // id: 12,
    patientId: 10,  // Patient 5
    doctorId: 2,   // Doctor 1
    dateTime: new Date('2025-05-10T11:00:00Z'), // Future appointment
    complaint: 'Joint pain',
    insurance: 'Aetna',
    dateMet: null
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Appointment.bulkCreate(appointmentSeeds, 
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Appointments', null, 
      { schema: options.schema });
  }
};
