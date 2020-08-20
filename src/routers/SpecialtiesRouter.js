const SpecialtiesRouter = require('express').Router();

const SpecialtiesController = require('../controllers/SpecialtiesController');

const AuthMasterMiddleware = require('../middlewares/authentication/AuthMasterMiddleware');

SpecialtiesRouter.post('', AuthMasterMiddleware, SpecialtiesController.create);
SpecialtiesRouter.get('', AuthMasterMiddleware, SpecialtiesController.getAll);
SpecialtiesRouter.put('/:specialtyId(\\d+)', AuthMasterMiddleware, SpecialtiesController.update);
SpecialtiesRouter.delete('/:specialtyId(\\d+)', AuthMasterMiddleware, SpecialtiesController.delete);

module.exports = SpecialtiesRouter;
