const { validationResult } = require('express-validator');

// Validation error handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  }

  next();
};

// Async handler to catch errors
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
