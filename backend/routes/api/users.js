const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models'); 

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.'),
    handleValidationErrors
]

router.get('/allPatients', requireAuth, async (req, res) => {
  const allPatients = await User.findAll({
    where: { staff: false }
  });

  if (!allPatients) {
    return res.status(404).json({ message: 'All Patients not found' })
  }

  return res.status(200).json({ allPatients: allPatients })
})

router.get('/allStaff', requireAuth, async (req, res) => {
  const allStaff = await User.findAll({
    where: { staff: true }
  });

  if (!allStaff) {
    return res.status(404).json({ message: 'All Staff not found' })
  }

  return res.status(200).json({ allStaff: allStaff })
})

router.get('/doctors', requireAuth, async (req, res) => {
  const user = await User.findAll({
    where: {
      position: 'doctor'
    },
    attributes: ['id', 'firstName', 'lastName']
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ user: user });
})

// GET detail of a User based on userId
router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;

    // if (!req.user) {
    //   return res.status(200).json({ user: null });
    // }

  const user = await User.findByPk(userId, {
    attributes: { 
      exclude: ['password']
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const reorderedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    username: user.username,
    email: user.email,
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    phone: user.phone,
    allergy: user.allergy,
    dateInactive: user.dateInactive,
    staff: user.staff,
    position: user.position
  };

  return res.status(200).json({ user: reorderedUser });
})

// POST (create) a new User = sign-up
router.post(
  '/',   
  validateSignup,
  async (req, res) => {
    const { 
      firstName,
      lastName,
      dateOfBirth,
      gender,
      username,
      email, 
      password, 
      address,
      city,
      state,
      zip,
      phone,
      allergy,
      staff,
      position
      } = req.body;
    
    if (
      !firstName ||
      !lastName || 
      !dateOfBirth ||
      !gender ||
      !username || 
      !email || 
      !password ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !phone ||
      staff === true && !position ||
      staff === false && position
      ) {
      return res.status(400).json({
        message: "Bad Request.",
        errors: {
          firstName: "First name is required",
          lastName: "Last name is required",
          dateOfBirth: "Date of Birth is required",
          gender: "Gender is required",
          username: "Username is required",
          email: "Email is required",
          password: "Password is required",
          address: "Address is required",
          city: "City is required",
          state: "State is required",
          zip: "Zip code is required",
          phone: "Phone is required",
          staff: "Staff indicator is required = 'True' for staff, 'False' for non-staff",
          position: "Position is required for a staff"
        }
      })
    }

    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [
          { email },
          { username } 
        ]
      }
    });
   
    if (existingUser) {
      return res.status(500).json({ 
        message: "User already exists",
        errors: {
          email: "User with that email or username already exists",
          username: "User with that username or email already exists"
        } 
      });
    };
    
    const hashedPassword = bcrypt.hashSync(password);

//create user
    const newUser = await User.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      username,
      email,
      password: hashedPassword,
      address,
      city,
      state,
      zip,
      phone,
      allergy,
      staff,
      position
    });

//cookie and resp w/ data

    const safeUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username
    };
    await setTokenCookie(res, safeUser);
  
    return res.status(201).json({
      user: newUser
    });
  });

// update a User
router.put('/:userId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;

  const { 
    firstName,
    lastName,
    dateOfBirth,
    gender,
    username,
    email, 
    password, 
    address,
    city,
    state,
    zip,
    phone,
    allergy,
    dateInactive,
    staff,
    position
    } = req.body;

    try {
      const userUpdate = await User.findByPk(userId);

      if (userUpdate) {
        if (firstName) userUpdate.firstName = firstName;
        if (lastName) userUpdate.lastName = lastName;
        if (dateOfBirth) userUpdate.dateOfBirth = dateOfBirth;
        if (gender) userUpdate.gender = gender;
        if (username) userUpdate.username = username;
        if (email) userUpdate.email = email;
        // userUpdate.password = password;    // this create issue in updating - need to be handled later
        if (address) userUpdate.address = address;
        if (city) userUpdate.city = city;
        if (state) userUpdate.state = state;
        if (zip) userUpdate.zip = zip;
        if (phone) userUpdate.phone = phone;
        if (allergy) userUpdate.allergy = allergy;
        if (userUpdate.dateInactive && !dateInactive) userUpdate.dateInactive = null;
        if (dateInactive) userUpdate.dateInactive = dateInactive;
        if (staff) userUpdate.staff = staff;
        if (position) userUpdate.position = position;
      }

      const updatedUser = await userUpdate.save();

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while updating a User", error })
    }
})

// delete a User
router.delete('/:userId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;
  const todayDate = new Date();

  try {
    // check the user first
    const oneUser = await User.findByPk(id);
    if (!oneUser || oneUser.length <= 0) {
      return res.status(403).json({ message: "The User is NOT Exist" })
    } else {
      if (oneUser.staff !== true && 
        (oneUser.position !== 'manager' || oneUser.position !== 'doctor')) 
      {
        return res.status(403).json({ message: "The User is NOT Authorized" })
      }
    }

    if (Number(id) === Number(userId)) {
      return res.status(403).json({ message: "You are not Authorized to Delete yourself" })
    }

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete || userToDelete.length <= 0) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    // for patient, check the inactive date = should be more than 5 years
    if (oneUser.staff === false) {
      const parsedDateInactive = new Date(dateInactive);
      const timeDifference = todayDate - parsedDateInactive;
      const yearsDifference = timeDifference / (1000 * 3600 * 24 * 365.25);
      if (yearsDifference <= 5) {
        return res.status(403).json({ message: "The User can't be deleted, less than 5 years of being in-active" })
      }
    }

    await userToDelete.destroy();
    return res.status(200).json({ message: "Successfully deleted" })
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting a User", error })
  }
}); 

module.exports = router;