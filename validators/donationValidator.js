const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.createDonationAsGuestValidator = async (req) => {
    req.check('email', 'email is required.').not().isEmpty();
    req.check('fullname', 'fullname is required.').not().isEmpty();
    req.check('campaignId', 'campaign id is required').not().isEmpty();
    req.check('donation.amount', 'amount is required').not().isEmpty();
    req.check('donation.method', 'donation method is required').not().isEmpty();
    
    return raiseErr(req);
}

exports.createDonationAsMemberValidator = async (req) => {
    req.check('userId', 'user id is required').not().isEmpty();
    req.check('campaignId', 'campaign id is required').not().isEmpty();
    req.check('donation.amount', 'amount is required').not().isEmpty();
    req.check('donation.method', 'donation method is required').not().isEmpty();
    
    return raiseErr(req);
}
