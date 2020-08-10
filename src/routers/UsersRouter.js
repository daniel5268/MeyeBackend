const UsersRouter = require('express').Router();

const UsersController = require('../controllers/UsersController');
const PjsController = require('../controllers/PjsController');

UsersRouter.post('', UsersController.create);
UsersRouter.get('', UsersController.getAll);
UsersRouter.put('/:userId(\\d+)', UsersController.update);
UsersRouter.delete('/:userId(\\d+)', UsersController.delete);

UsersRouter.post('/:userId(\\d+)/pjs', PjsController.create);

module.exports = UsersRouter;
