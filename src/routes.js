const express = require('express');

const router = express.Router();

const UsersRouter = require('./routers/UsersRouter');
const UsersController = require('./controllers/UsersController');

router.post('/sign-in', UsersController.signIn);

router.use('/users', UsersRouter);

module.exports = router;
