const PjsRouter = require('express').Router();

const PjsController = require('../controllers/PjsController');

const AuthMasterMiddleware = require('../middlewares/authentication/AuthMasterMiddleware');

PjsRouter.post('/:pjId(\\d+)/xp-assignations', AuthMasterMiddleware, PjsController.assignXp);
PjsRouter.put('/:pjId(\\d+)/specialties/:specialtyId(\\d+)', AuthMasterMiddleware, PjsController.assignSpecialty);

module.exports = PjsRouter;
