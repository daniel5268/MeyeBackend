const { GetFormattedError } = require('../../utils/ErrorUtils');
const JwtService = require('../../services/JwtService');

module.exports = (req, res, next) => {
  const section = 'AuthAdminMiddleware';
  const { logger = console, headers: { authorization } } = req;
  logger.info(section, 'starts');

  const options = { logger };

  if (!authorization) throw new GetFormattedError('Unauthorized', 401, 401);

  const token = authorization.replace('bearer ', '');

  try {
    const userVerifiedToken = JwtService.verify(token, options);
    const { is_admin: isAdmin } = userVerifiedToken;

    if (!isAdmin) throw new GetFormattedError('Forbidden', 403, 403);
  } catch (error) {
    const { status } = error;

    if (status === 403) throw error;

    throw new GetFormattedError('An error ocurred while trying to retrieve token info', 500, 500);
  }

  return next();
};
