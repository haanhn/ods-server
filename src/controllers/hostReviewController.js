const hostReviewService = require('../services/hostReviewService');

exports.getAll = async (req, res, next) => {
    try {
        const result = await hostReviewService.getAll(req);
        if (result) {
            return res.status(200).json({ success: 'true', result});
        }
        return res.status(400).json({ success: 'fail', message: 'Cannot find this host'})
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getOverall = async (req, res, next) => {
    try {
        const result = await hostReviewService.getOverall(req);
        if (result) {
            return res.status(200).json({ success: 'true', result});
        }
        return res.status(400).json({ success: 'fail', message: 'Cannot find this host'})
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.checkAllow = async (req, res, next) => {
    try {
        const result = await hostReviewService.checkAllow(req);
            if (result === -1) {
                return res.status(200).json({ success: 'true', message: 'you are dont have any donation for campaign of this host', result})
            } else if (result === 2) {
                return res.status(200).json({ success: 'true', message: 'you has a review to this host', result });
            } else {
                return res.status(200).json({ success: 'true', message: 'you can review this host', result });
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.create = async (req, res, next) => {
    try {
        const result = await hostReviewService.create(req);
            if (result != false) {
                return res.status(201).json({ success: 'true', message: "Review created successfully", result });
            } else {
                return res.status(400).json({ success: 'false', message: 'cannot find this host'})
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const result = await hostReviewService.destroy(req);
        if (result != false) {
            return res.status(200).json({ success: 'true', message: "Review deleted successfully", result });
        } else {
            return res.status(400).json({ success: 'false', message: 'cannot find this review'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}