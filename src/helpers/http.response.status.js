// eslint-disable-next-line max-len
const httpStatusResponse = (res, statusCode, msgParameters) => res.status(statusCode).json(msgParameters);

module.exports = httpStatusResponse;
