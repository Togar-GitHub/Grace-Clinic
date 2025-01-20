'use strict';

const { CPT } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const cptCodeSeeds = [
  {
    // id: 1,      // all id only for development
    CPTCode: '99201',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 50.00
  },
  {
    // id: 2,
    CPTCode: '99202',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 75.00
  },
  {
    // id: 3,
    CPTCode: '99203',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 100.00
  },
  {
    // id: 4,
    CPTCode: '99204',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 150.00
  },
  {
    // id: 5,
    CPTCode: '99205',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 200.00
  },
  {
    // id: 6,
    CPTCode: '99211',
    description: 'Office or other outpatient visit for the evaluation and management of an established patient.',
    price: 30.00
  },
  {
    // id: 7,
    CPTCode: '99212',
    description: 'Office or other outpatient visit for the evaluation and management of an established patient.',
    price: 60.00
  },
  {
    // id: 8,
    CPTCode: '99213',
    description: 'Office or other outpatient visit for the evaluation and management of an established patient.',
    price: 90.00
  },
  {
    // id: 9,
    CPTCode: '99214',
    description: 'Office or other outpatient visit for the evaluation and management of an established patient.',
    price: 120.00
  },
  {
    // id: 10,
    CPTCode: '99215',
    description: 'Office or other outpatient visit for the evaluation and management of an established patient.',
    price: 150.00
  },
  {
    // id: 11,
    CPTCode: '99217',
    description: 'Observation care discharge from a facility.',
    price: 45.00
  },
  {
    // id: 12,
    CPTCode: '99218',
    description: 'Initial observation care, per day.',
    price: 80.00
  },
  {
    // id: 13,
    CPTCode: '99219',
    description: 'Subsequent observation care.',
    price: 90.00
  },
  {
    // id: 14,
    CPTCode: '99220',
    description: 'Initial observation care, per day.',
    price: 100.00
  },
  {
    // id: 15,
    CPTCode: '99341',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 50.00
  },
  {
    // id: 16,
    CPTCode: '99342',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 75.00
  },
  {
    // id: 17,
    CPTCode: '99343',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 100.00
  },
  {
    // id: 18,
    CPTCode: '99344',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 125.00
  },
  {
    // id: 19,
    CPTCode: '99345',
    description: 'Office or other outpatient visit for the evaluation and management of a new patient.',
    price: 150.00
  },
  {
    // id: 20,
    CPTCode: '99347',
    description: 'Home or other outpatient visit for the evaluation and management of an established patient.',
    price: 60.00
  },
  {
    // id: 21,
    CPTCode: '99348',
    description: 'Home or other outpatient visit for the evaluation and management of an established patient.',
    price: 90.00
  },
  {
    // id: 22,
    CPTCode: '99349',
    description: 'Home or other outpatient visit for the evaluation and management of an established patient.',
    price: 120.00
  },
  {
    // id: 23,
    CPTCode: '99350',
    description: 'Home or other outpatient visit for the evaluation and management of an established patient.',
    price: 150.00
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await CPT.bulkCreate(cptCodeSeeds, 
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CPTs', null, 
      { schema: options.schema });
  }
};

