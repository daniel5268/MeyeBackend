const UsersRouter = require('express').Router();

const UsersController = require('../controllers/UsersController');
const PjsController = require('../controllers/PjsController');
const AuthAdminMiddleware = require('../middlewares/authentication/AuthAdminMiddleware');
const AuthMasterOrPlayerMiddleware = require('../middlewares/authentication/AuthMasterOrPlayerMiddleware');

UsersRouter.post('', AuthAdminMiddleware, UsersController.create);
UsersRouter.get('', AuthAdminMiddleware, UsersController.getAll);
UsersRouter.put('/:userId(\\d+)', AuthAdminMiddleware, UsersController.update);
UsersRouter.delete('/:userId(\\d+)', AuthAdminMiddleware, UsersController.delete);

UsersRouter.post('/:userId(\\d+)/pjs', AuthMasterOrPlayerMiddleware, PjsController.create);
UsersRouter.put('/:userId(\\d+)/pjs/:pjId(\\d+)', AuthMasterOrPlayerMiddleware, PjsController.update);

module.exports = UsersRouter;
