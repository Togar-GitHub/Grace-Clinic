const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: {
              username: credential,
              email: credential
            }
          },
          {
            dateInactive: null  // Check if dateInactive is null
          }
        ]
      }
    });

    if (!user || !bcrypt.compareSync(password, user.password.toString())) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.title = 'Invalid credentials';
      err.errors = { credential: 'The provided credentials were invalid or inactive' };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      staff: user.staff,
      position: user.position
    };

    await setTokenCookie(res, safeUser);

    return res.status(200).json({
      user: safeUser
    });
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Get the current User
router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        staff: user.staff,
        position: user.position,
      };
      return res.status(200).json({
        user: safeUser
      });
    } else return res.status(200).json({ user: null });
  }
);

module.exports = router;