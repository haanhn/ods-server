const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.createPostValidator = async (req) => {
    req.check('campaignId', 'campaign id is required.').not().isEmpty();
    req.check('post.postTitle', 'postTitle is required.').not().isEmpty();
    req.check('post.postContent', 'postContent id is required').not().isEmpty();
    
    return raiseErr(req);
}

exports.updatePostValidator = async (req) => {
    req.check('post.postId', 'postId id is required.').not().isEmpty();
    req.check('post.postTitle', 'postTitle is required.').not().isEmpty();
    req.check('post.postContent', 'postContent id is required').not().isEmpty();
    
    return raiseErr(req);
}