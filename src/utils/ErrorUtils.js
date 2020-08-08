const ErrorUtils = module.exports;

ErrorUtils.GetFormattedError = function (message, code, status) {
  this.message = message;
  this.status = status || code;
  this.code = code;
};
