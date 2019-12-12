const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Dublicate name ${value}, please use different value`;

  return new AppError(message, 400);
};
const handleJWTToken = () => {
  const message = `invalid token `;
  return new AppError(message, 401);
};
const handleJWTExpiredToken = () => {
  const message = `Expired Token`;
  return new AppError(message, 401);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  //operational error that we can send
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //we don't send this kind of errors
    //for us
    console.error('Error from Error controller');

    //send response
    res.status(500).json({
      status: 'error',
      message: 'something went wrong(prod)'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTToken(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredToken(error);
    sendErrorProd(error, res);
  }
};
