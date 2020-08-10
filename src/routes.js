const express = require('express');

const router = express.Router();

const UsersRouter = require('./routers/UsersRouter');
const UsersController = require('./controllers/UsersController');
const AuthAdminMiddleware = require('./middlewares/authentication/AuthAdminMiddleware');

router.post('/sign-in', UsersController.signIn);

router.use('/users', AuthAdminMiddleware, UsersRouter);

module.exports = router;
