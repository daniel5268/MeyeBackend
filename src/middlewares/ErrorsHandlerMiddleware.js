// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { status = 500, message = 'Error', code = 500 } = err;

  return res.status(status).send({ error: { message, code } });
};
