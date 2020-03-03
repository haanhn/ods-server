
const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.createCommentValidator = async (req) => {
    req.check('campaign.id', 'Campaign id is required.').not().isEmpty();
    req.check('comment.content', 'comment is required.').not().isEmpty();
    
    return raiseErr(req);
} 

exports.getAllValidator = async (req) => {
    req.check('campaign.id', 'campaign id is required').not().isEmpty();
    return raiseErr(req);
}