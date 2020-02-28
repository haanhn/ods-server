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

exports.updateAddressValidator = async (req) => {
    req.check('address', 'address is required.').not().isEmpty();
    req.check('region', 'region is require.').not().isEmpty();

    return raiseErr(req);
}