const UsersRouter = require('express').Router();

const UsersController = require('../controllers/UsersController');

UsersRouter.post('', UsersController.create);

module.exports = UsersRouter;
