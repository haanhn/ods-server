// const { check, validationResult  } = require('express-validator');

const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

const registerValidator = async (req) => {
    req.check('user.email', 'email is required.').not().isEmpty();
    req.check('user.email', 'Invalid email.').isEmail();
    req.check('user.password', 'password is required.').not().isEmpty();
    req.check('user.password', 'Password must be more than 6 characters.').isLength({ min: 5 });
    req.check('user.fullname', 'fullname is require.').not().isEmpty();
    req.check('otpToken', 'Token is require.').not().isEmpty();

    return raiseErr(req);
}

const getOTPValidator = async (req) => {
    req.check('user.email', 'email is required.').not().isEmpty();
    req.check('user.email', 'Invalid email.').isEmail();

    return raiseErr(req);
}

const loginValidator = async (req) => {
    req.check('user.email', 'email is required.').not().isEmpty();
    req.check('user.email', 'Invalid email.').isEmail();
    req.check('user.password', 'password is required.').not().isEmpty();
    req.check('user.password', 'Password must be more than 6 characters.').isLength({ min: 5 });

    return raiseErr(req);
}


const newPasswordValidatior = async (req) => {
    req.check('user.email', 'email is required.').not().isEmpty();
    req.check('user.email', 'Invalid email.').isEmail();
    req.check('user.password', 'password is required.').not().isEmpty();
    req.check('user.password', 'Password must be more than 6 characters.').isLength({ min: 5 });
    req.check('resetToken', 'Token is require.').not().isEmpty();

    return raiseErr(req);
}


module.exports = {
    registerValidator, getOTPValidator, loginValidator, newPasswordValidatior
}