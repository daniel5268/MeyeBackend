const express = require('express');

const router = express.Router();

const UsersRouter = require('./routers/UsersRouter');
const SpecialtiesRouter = require('./routers/SpecialtiesRouter');
const UsersController = require('./controllers/UsersController');
const PjsRouter = require('./routers/PjsRouter');

router.use('/users', UsersRouter);
router.use('/specialties', SpecialtiesRouter);
router.use('/pjs', PjsRouter);

router.post('/sign-in', UsersController.signIn);

module.exports = router;
