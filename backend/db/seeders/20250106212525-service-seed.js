'use strict';

const { Service } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const serviceSeeds = [
  {
    id: 1,      // all id only for development
    service: 'Blood work',
    price: 150.00  // Replace with the actual price as needed
  },
  {
    id: 2,
    service: 'Urine test',
    price: 80.00  // Replace with the actual price as needed
  },
  {
    id: 3,
    service: 'X-ray',
    price: 200.00  // Replace with the actual price as needed
  },
  {
    id: 4,
    service: 'MRI',
    price: 1200.00  // Replace with the actual price as needed
  },
  {
    id: 5,
    service: 'CT scan',
    price: 1000.00  // Replace with the actual price as needed
  },
  {
    id: 6,
    service: 'Ultrasound',
    price: 250.00  // Replace with the actual price as needed
  },
  {
    id: 7,
    service: 'Minor surgical procedures',
    price: 500.00  // Replace with the actual price as needed
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Service.bulkCreate(serviceSeeds, 
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', null, 
      { schema: options.schema });
  }
};
