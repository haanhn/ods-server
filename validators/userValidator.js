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

const updateAddressValidator = async (req) => {
    req.check('address', 'address is required.').not().isEmpty();
    req.check('regionId', 'regionId is require.').not().isEmpty();

    return raiseErr(req);
}

const createBankAccountValidator = async (req) => {
    req.check('bankAccount.bankName', 'Bank name is required.').not().isEmpty();
    req.check('bankAccount.bankAgency', 'Bank agency is required.').not().isEmpty();
    req.check('bankAccount.accountNumber', 'Account number is required.').not().isEmpty();

    return raiseErr(req);
}

module.exports = {
    updateAddressValidator, createBankAccountValidator
}