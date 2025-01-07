'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const reviewSeeds = [
  {
    // id: 1,      // all id only for development
    patientId: 6, // Michael Taylor
    review: 'The service was excellent, and the staff was very friendly!',
    stars: 5,
  },
  {
    // id: 2,
    patientId: 6, // Michael Taylor
    review: 'I had to wait a bit longer than expected, but overall the experience was good.',
    stars: 4,
  },
  {
    // id: 3,
    patientId: 7, // Sophia Martinez
    review: 'The doctor was very professional and thorough with the examination.',
    stars: 5,
  },
  {
    // id: 4,
    patientId: 8, // David Wilson
    review: 'I didn\'t feel like the doctor was very attentive. Could improve on patient care.',
    stars: 2,
  },
  {
    // id: 5,
    patientId: 9, // Olivia Anderson
    review: 'Very nice experience. I would definitely recommend this place to others.',
    stars: 4,
  },
  {
    // id: 6,
    patientId: 9, // Olivia Anderson
    review: 'The waiting time was long, but the treatment was top-notch!',
    stars: 4,
  },
  {
    // id: 7,
    patientId: 10, // James Garcia
    review: 'Staff was friendly, and I felt well taken care of during my appointment.',
    stars: 5,
  },
  {
    // id: 8,
    patientId: 10, // James Garcia
    review: 'I wasn\'t happy with the appointment scheduling, but everything else was fine.',
    stars: 3,
  },
  {
    // id: 9,
    patientId: 6, // Michael Taylor
    review: 'Great experience, and the doctor was very knowledgeable.',
    stars: 5,
  },
  {
    // id: 10,
    patientId: 8, // David Wilson
    review: 'I did not like the environment and felt uncomfortable during the visit.',
    stars: 1,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(reviewSeeds, 
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, 
      { schema: options.schema });
  }
};

