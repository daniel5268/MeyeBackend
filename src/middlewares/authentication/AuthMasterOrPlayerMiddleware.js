const { GetFormattedError } = require('../../utils/ErrorUtils');
const JwtService = require('../../services/JwtService');

module.exports = (req, res, next) => {
  const section = 'AuthMasterOrPlayerMiddleware';
  const { logger = console, headers: { authorization }, params: { userId } } = req;
  logger.debug(section, 'starts');

  const options = { logger };

  if (!authorization) throw new GetFormattedError('Unauthorized', 401, 401);

  const token = authorization.replace('bearer ', '');

  try {
    const userVerifiedToken = JwtService.verify(token, options);
    const { is_player: isPlayer, is_master: isMaster, id: clientUserId } = userVerifiedToken;

    if (!(isPlayer || isMaster) || (!isMaster && userId && (+userId !== clientUserId))) {
      throw new GetFormattedError('Forbidden', 403, 403);
    }

    const { headers } = req;
    const newHeaders = { ...headers, ...userVerifiedToken };
    req.headers = newHeaders;
  } catch (error) {
    const { status } = error;

    if (status === 403) throw error;

    throw new GetFormattedError('An error ocurred while trying to retrieve token info', 500, 500);
  }

  return next();
};
