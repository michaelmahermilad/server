const { body, validationResult } = require("express-validator");

const myown1 = {
  email: {
    isEmail: {
      errorMessage: "Not EMAIL",
    },
  },
};
const formOrder = {
  email: {
    isEmail: {
      errorMessage: "Not EMAIL",
    },
  },
  firstName: {
    isLength: {
      errorMessage: " should be at least 4 chars long",

      options: { min: 4 },
    },
  },
  lastName: {
    isLength: {
      errorMessage: " should be at least 4 chars long",

      options: { min: 4 },
    },
  },
  budget: {
    isLength: {
      errorMessage: " should be at least 4 chars long",

      options: { min: 4 },
    },
  },
  address: {
    isLength: {
      errorMessage: " should be at least 4 chars long",

      options: { min: 4 },
    }},
    country: {
      isLength: {
        errorMessage: " should be at least 2 chars long",
  
        options: { min: 2 },
      }},
      region: {
        isLength: {
          errorMessage: " should be at least 1 chars long",
    
          options: { min: 1 },
        }},
        date: {
          isLength: {
            errorMessage: " should be Date",
            options: { min: 2 },
             
          }},
  
  phone: {
    isInt: {
      errorMessage: " should be at least int chars ",
    },
  }};


const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  next();
};
module.exports = { Validate, myown1, formOrder };
