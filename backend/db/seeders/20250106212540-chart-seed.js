'use strict';

const { Chart } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const chartSeeds = [
  {
    // id: 1,   // all id only for development
    patientId: 6,  // Patient 1
    doctorId: 2,   // Doctor 1
    appointmentId: 1,  // Appointment 1
    complaint: 'Severe headache',
    meetingDate: new Date('2024-12-01T10:30:00Z'),
    diagnosesICD10: 'G44.1, G44.5',  // Example ICD10 for tension-type headache
    diagnosesDesc: 'Tension-type headache',
    CPTId: 5,  // Assuming this is for office visit CPT code
    title: 'Headache Consultation',
    doctorNote: 'Patient reported severe headache, treated with pain management.',
    services: [1, 2],  // Service IDs from the Services table (example)
    prescription: 'Ibuprofen 200mg',
    insurance: 'Aetna',
    cost: null,
    nextAppointment: new Date('2025-01-15T14:00:00Z')
  },
  {
    // id: 2,
    patientId: 7,  // Patient 2
    doctorId: 5,   // Doctor 1
    appointmentId: 4,  // Appointment 4
    complaint: 'Cough and cold',
    meetingDate: new Date('2024-11-25T11:30:00Z'),
    diagnosesICD10: 'J00',  // ICD10 for acute nasopharyngitis
    diagnosesDesc: 'Acute nasopharyngitis',
    CPTId: 8,  // Assuming this is for office visit CPT code
    title: 'Cold Consultation',
    doctorNote: 'Patient presented with typical symptoms of a common cold.',
    services: [1],  // Service IDs from the Services table
    prescription: 'Cough syrup',
    insurance: 'Cigna',
    cost: null,
    nextAppointment: new Date('2025-02-05T09:00:00Z')
  },
  {
    // id: 3,
    patientId: 8,  // Patient 3
    doctorId: 5,   // Doctor 1
    appointmentId: 7,  // Appointment 7
    complaint: 'Knee pain',
    meetingDate: new Date('2024-10-10T15:30:00Z'),
    diagnosesICD10: 'M17.9, M18.5',  // ICD10 for osteoarthritis of the knee
    diagnosesDesc: 'Osteoarthritis of the knee',
    CPTId: 4,  // Assuming this is for office visit CPT code
    title: 'Knee Pain Consultation',
    doctorNote: 'Patient presented with chronic knee pain, most likely osteoarthritis.',
    services: [3],  // Service IDs from the Services table
    prescription: 'Glucosamine sulfate',
    insurance: 'Aetna',
    cost: null,
    nextAppointment: new Date('2025-03-20T08:30:00Z')
  },
  {
    // id: 4,
    patientId: 9,  // Patient 4
    doctorId: 2,   // Doctor 1
    appointmentId: 9,  // Appointment 9
    complaint: 'Stomach ache',
    meetingDate: new Date('2024-12-10T14:00:00Z'),
    diagnosesICD10: 'R10.9',  // ICD10 for unspecified abdominal pain
    diagnosesDesc: 'Abdominal pain',
    CPTId: 10,  // Assuming this is for office visit CPT code
    title: 'Abdominal Pain Consultation',
    doctorNote: 'Patient reported intermittent stomach pain.',
    services: [5],  // Service IDs from the Services table
    prescription: 'Antacids',
    insurance: 'Cigna',
    cost: null,
    nextAppointment: new Date('2025-04-01T10:00:00Z')
  },
  {
    // id: 5,
    patientId: 10,  // Patient 5
    doctorId: 2,   // Doctor 1
    appointmentId: 11,  // Appointment 11
    complaint: 'Sore throat',
    meetingDate: new Date('2024-11-01T12:30:00Z'),
    diagnosesICD10: 'J02.9, J03.5',  // ICD10 for acute pharyngitis
    diagnosesDesc: 'Acute pharyngitis',
    CPTId: 7,  // Assuming this is for office visit CPT code
    title: 'Sore Throat Consultation',
    doctorNote: 'Patient complains of a sore throat, suspected acute pharyngitis.',
    services: [],  // Service IDs from the Services table
    prescription: 'Throat lozenges',
    insurance: 'Aetna',
    cost: null,
    nextAppointment: new Date('2025-05-10T11:00:00Z')
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Chart.bulkCreate(chartSeeds, 
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Charts', null, 
      { schema: options.schema });
  }
};
