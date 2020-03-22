const campaignReviewService = require('../services/campaignReviewService');

exports.getAll = async (req, res, next) => {
    try {
        const result = await campaignReviewService.getAll(req);
        if (result) {
            return res.status(200).json({ success: 'true', result});
        }
        return res.status(400).json({ success: 'fail', message: 'Cannot find this campaign'})
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getOverall = async (req, res, next) => {
    try {
        const result = await campaignReviewService.getOverall(req);
        if (result) {
            return res.status(200).json({ success: 'true', result});
        }
        return res.status(400).json({ success: 'fail', message: 'Cannot find this campaign'})
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.checkAllow = async (req, res, next) => {
    try {
        const result = await campaignReviewService.checkAllow(req);
            if (result != false) {
                return res.status(200).json({ success: 'true', result });
            } else {
                return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.create = async (req, res, next) => {
    try {
        const result = await campaignReviewService.create(req);
            if (result != false) {
                return res.status(201).json({ success: 'true', message: "Review created successfully", result });
            } else {
                return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const result = await campaignReviewService.destroy(req);
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