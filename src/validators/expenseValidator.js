const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.createValidator = async (req) => {
    req.check('expense.title', 'title is required.').not().isEmpty();
    req.check('expense.cost', 'category is required.').not().isEmpty();
    
    return raiseErr(req);
}

exports.updateValidator = async (req) => {
    req.check('expense.id', 'id is required.').not().isEmpty();
    req.check('expense.title', 'title is required.').not().isEmpty();
    req.check('expense.cost', 'category is required.').not().isEmpty();
    
    return raiseErr(req);
}