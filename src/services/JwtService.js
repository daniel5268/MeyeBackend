const jwt = require('jsonwebtoken');

const { TOKEN_ISSUER, TOKEN_EXPIRATION_TIME, PRIVATE_KEY } = process.env;

const JwtService = module.exports;

JwtService.sign = (payload, options = {}) => {
  const section = 'JwtService.sign';
  const { logger = console } = options;
  logger.debug(section, `starts with ${JSON.stringify({ payload })}`);

  const signOptions = {
    issuer: TOKEN_ISSUER,
    expiresIn: `${TOKEN_EXPIRATION_TIME}h`,
  };

  return jwt.sign(payload, PRIVATE_KEY, signOptions);
};

JwtService.verify = (token, options = {}) => {
  const section = 'JwtService.verify';
  const { logger = console } = options;
  logger.debug(section, `starts with token ${token}`);

  const verifyOptions = {
    issuer: TOKEN_ISSUER,
    expiresIn: `${TOKEN_EXPIRATION_TIME}h`,
  };

  return jwt.verify(token, PRIVATE_KEY, verifyOptions);
};
