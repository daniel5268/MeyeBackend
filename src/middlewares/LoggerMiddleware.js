const CryptoRandomString = require('crypto-random-string');
const log4js = require('log4js');

const { LOGGER_LEVEL = 'WARN' } = process.env;

log4js.configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: LOGGER_LEVEL },
  },
  replaceConsole: true,
});

module.exports = (req, res, next) => {
  req.logger = log4js.getLogger(CryptoRandomString({ length: 10, type: 'numeric', level: LOGGER_LEVEL }));

  return next();
};
