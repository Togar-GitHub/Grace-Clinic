const router = require('express').Router();

const { restoreUser, requireAuth } = require('../../utils/auth.js');

// list of const ...Router = require('./component.js);
const sessionRouter = require('./session.js');
const managerRouter = require('./manager.js')
const usersRouter = require('./users.js');
const reviewRouter = require('./review.js');
const serviceRouter = require('./service.js');
const cptRouter = require('./cpt.js');

router.use(restoreUser);

// list of router.use('/component', ...Router);
router.use('/session', sessionRouter);
router.use('manager', managerRouter);
router.use('/users', usersRouter);
router.use('/review', reviewRouter);
router.use('/service', serviceRouter);
router.use('/cpt', cptRouter);

// GET /api/restore-user
router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

router.get('/test', requireAuth, (req, res) => {
  res.json ({ message: 'success' })
});

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;