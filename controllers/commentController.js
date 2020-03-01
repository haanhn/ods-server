const commentService = require('../services/commentService');
const commentValidator = require('../validators/commentValidator');

exports.create = async (req, res, next) => {
    try {
        const validator = await commentValidator.createCommentValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const comment = await commentService.create(req);
            if (comment !== false) {
                return res.status(201).json({ success: 'true', message: "Comment has been posted successfully", comment });
            } else {
                return res.status(400).json({ success: 'false', message: 'Cannot find this campaign'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}