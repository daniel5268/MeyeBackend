const UsersRouter = require('express').Router();

const UsersController = require('../controllers/UsersController');

UsersRouter.post('', UsersController.create);
UsersRouter.put('/:userId(\\d+)', UsersController.update);

module.exports = UsersRouter;
