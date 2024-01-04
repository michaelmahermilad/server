class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
const notFound = (req, res, next) => {

 
    next();
 
    

};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Interval server error" ;
  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resources not found with this id..Invalid ${err.path}`;

    err = new ErrorHandler(message);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message);
  }

  // Wrong Jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again`;
    err = new ErrorHandler(message, 400);
  }

  //Jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Your url is expired please try again`;
    err = new ErrorHandler(message, 400);
  }
 
  res.status(404).json({
    success: false,
    message: err.message,
    status: err.status,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
