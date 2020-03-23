const followService = require('../services/followService');

exports.follow = async (req, res, next) => {
    try {
        const result = await followService.follow(req);
        if (result === -1) {
            return res.status(400).json({ success: 'fail', message: 'Input atleast one of email or user id'});
        } 
        if (result === 0) {
            return res.status(200).json({ success: 'true', message: 'you are has been followed this campaign'});
        }
        return res.status(201).json({ success: 'true', message: 'followed this campaign successfully'});
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.checkFollowing = async (req, res, next) => {
    try {
        const result = await followService.checkFollowing(req);
        if (!result) {
            return res.status(200).json({ success: 'true', message: 'this user is not following the campaign', follow: false });
        }
        return res.status(201).json({ success: 'true', message: 'this user is following the campaign', follow: true });
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}