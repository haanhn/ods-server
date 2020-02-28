
const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.findBankAccountValidator = async (req) => {
    req.check('accountNumber', 'Account number is required').not().isEmpty();

    return raiseErr(req);
}

exports.createBankAccountValidator = async (req) => {
    req.check('bankAccount.bankName', 'Bank name is required.').not().isEmpty();
    req.check('bankAccount.bankAgency', 'Bank agency is required.').not().isEmpty();
    req.check('bankAccount.accountNumber', 'Account number is required.').not().isEmpty();

    return raiseErr(req);
}
