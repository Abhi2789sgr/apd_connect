const { check, validationResult } = require('express-validator');
exports.validateResult = [
    check('first_name').exists().withMessage('first_name cannot be empty.'),
    check('last_name').exists().withMessage('last_name cannot be empty.'),
    check('email').exists().withMessage('email cannot be empty.'),
    check('email').isEmail().withMessage('enter a valid email.'),
    check('password').exists().withMessage('password cannot be empty.'),
    check('password').isLength({ min: 6 }).matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      ).withMessage('password at least 6 character and contain At least one uppercase.At least one lower case.At least one special character.'),
    check('phone_number').exists().withMessage('phone_number cannot be empty.'),
    // check('company').exists().withMessage('company name cannot be empty.'),
    check('country').exists().withMessage('country cannot be empty.'),
    check('state').exists().withMessage('state cannot be empty.'),
    check('city').exists().withMessage('city cannot be empty.'),
    check('zip').exists().withMessage('zip cannot be empty.'),
    check('role').exists().withMessage('role cannot be empty.'),
  ]