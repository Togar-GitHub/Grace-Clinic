'use strict';

const { User } = require('../models')
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const userSeeds = [
  {
    id: 1,             // all the id only for development
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1985-06-15'),
    gender: 'male',
    username: 'johndoe',
    email: 'john.doe@example.com',
    password: bcrypt.hashSync('passjohndoe'),
    address: '123 Elm St',
    city: 'Somewhere',
    state: 'CA',
    zip: '90210',
    phone: '2135551234',
    allergy: 'Peanuts',
    dateInactive: null,
    staff: true,
    position: 'staff',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('1990-02-20'),
    gender: 'female',
    username: 'janesmith',
    email: 'jane.smith@example.com',
    password: bcrypt.hashSync('passjanesmith'),
    address: '456 Oak St',
    city: 'Anywhere',
    state: 'NY',
    zip: '10001',
    phone: '9095555678',
    allergy: 'None',
    dateInactive: null,
    staff: true,
    position: 'doctor',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: new Date('1982-12-05'),
    gender: 'female',
    username: 'alicejohnson',
    email: 'alice.johnson@example.com',
    password: bcrypt.hashSync('passalicejohnson'),
    address: '789 Pine St',
    city: 'Cityville',
    state: 'TX',
    zip: '75001',
    phone: '8185558765',
    allergy: 'Dust',
    dateInactive: null,
    staff: true,
    position: 'manager',
  },
  {
    id: 4,
    firstName: 'Bob',
    lastName: 'Brown',
    dateOfBirth: new Date('1978-09-30'),
    gender: 'male',
    username: 'bobbrown',
    email: 'bob.brown@example.com',
    password: bcrypt.hashSync('passbobbrown'),
    address: '101 Maple St',
    city: 'Townsville',
    state: 'FL',
    zip: '33101',
    phone: '4235553456',
    allergy: 'Shellfish',
    dateInactive: null,
    staff: true,
    position: 'staff',
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Davis',
    dateOfBirth: new Date('1995-11-10'),
    gender: 'female',
    username: 'emmadavis',
    email: 'emma.davis@example.com',
    password: bcrypt.hashSync('passemmadavis'),
    address: '202 Birch St',
    city: 'Villagetown',
    state: 'IL',
    zip: '60101',
    phone: '4515552345',
    allergy: 'Milk',
    dateInactive: null,
    staff: true,
    position: 'doctor',
  },

  // Patients
  {
    id: 6,
    firstName: 'Michael',
    lastName: 'Taylor',
    dateOfBirth: new Date('2000-03-22'),
    gender: 'male',
    username: 'michaeltaylor',
    email: 'michael.taylor@example.com',
    password: bcrypt.hashSync('passmichaeltaylor'),
    address: '303 Cedar St',
    city: 'Greensville',
    state: 'OH',
    zip: '44101',
    phone: '7235556789',
    allergy: 'None',
    dateInactive: null,
    staff: false,
    position: null,
  },
  {
    id: 7,
    firstName: 'Sophia',
    lastName: 'Martinez',
    dateOfBirth: new Date('2002-06-14'),
    gender: 'female',
    username: 'sophiamartinez',
    email: 'sophia.martinez@example.com',
    password: bcrypt.hashSync('passsophiamartinez'),
    address: '404 Elm St',
    city: 'Lakeside',
    state: 'MI',
    zip: '48101',
    phone: '8585552345',
    allergy: 'Pollen',
    dateInactive: null,
    staff: false,
    position: null,
  },
  {
    id: 8,
    firstName: 'David',
    lastName: 'Wilson',
    dateOfBirth: new Date('1999-05-11'),
    gender: 'male',
    username: 'davidwilson',
    email: 'david.wilson@example.com',
    password: bcrypt.hashSync('passdavidwilson'),
    address: '505 Birch St',
    city: 'Highland',
    state: 'CO',
    zip: '80301',
    phone: '4525553456',
    allergy: 'Latex',
    dateInactive: null,
    staff: false,
    position: null,
  },
  {
    id: 9,
    firstName: 'Olivia',
    lastName: 'Anderson',
    dateOfBirth: new Date('1997-08-18'),
    gender: 'female',
    username: 'oliviaanderson',
    email: 'olivia.anderson@example.com',
    password: bcrypt.hashSync('passoliviaanderson'),
    address: '606 Pine St',
    city: 'Sunrise',
    state: 'AZ',
    zip: '85201',
    phone: '8175556543',
    allergy: 'Dust Mites',
    dateInactive: null,
    staff: false,
    position: null,
  },
  {
    id: 10,
    firstName: 'James',
    lastName: 'Garcia',
    dateOfBirth: new Date('1988-04-10'),
    gender: 'male',
    username: 'jamesgarcia',
    email: 'james.garcia@example.com',
    password: bcrypt.hashSync('passjamesgarcia'),
    address: '707 Oak St',
    city: 'Riverside',
    state: 'CA',
    zip: '92501',
    phone: '7145559876',
    allergy: 'None',
    dateInactive: null,
    staff: false,
    position: null,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(userSeeds,
      { schema: options.schema,
        validate: true
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, 
      { schema: options.schema });
  }
};
