const postService = require('../services/postService');
const postValidator = require('../validators/postValidator');

exports.getAll = async (req, res, next) => {
    try {
        const result = await postService.getAll(req);
        if (result === 1) {
            return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
        } else {
            return res.status(200).json({ success: 'true', message: "fetch all public post successfully", result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.hostGetAll = async (req, res, next) => {
    try {
        const result = await postService.hostGetAll(req);
        if (result === 1) {
            return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
        } else {
            if (result === 2) {
                return res.status(400).json({  success: 'false',message: 'you are not a host of this campaign'})
            } else {
                return res.status(200).json({ success: 'true', message: "fetch all public post successfully", result });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.create = async (req, res, next) => {
    try {
        let validator = await postValidator.createPostValidator(req);
        if (validator !== null) {
            return res.status(400).send({ success: 'false', message: validator });
        }
        const result = await postService.create(req);
        if (result === 1) {
            return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
        } else {
            if (result === 2) {
                return res.status(400).json({ success: 'false', message: 'you are not a host of this campaign'})
            }
            return res.status(201).json({ success: 'true', message: "Post created successfully", result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.update = async (req, res, next) => {
    try {
        let validator = await postValidator.updatePostValidator(req);
        if (validator !== null) {
            return res.status(400).send({ success: 'false', message: validator });
        }
        const result = await postService.update(req);
        if (result[0] === 0) {
            return res.status(400).json({ success: 'false', message: 'cannot find this post'})
        }
        return res.status(200).json({ success: 'true', message: "success", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.delete = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({ message: 'post id is required' });
        }
        const result = await postService.deletePost(postId);
        const message = result ? 'delete post success' : 'no post found';
        return res.status(200).json({ success: true, message: message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}