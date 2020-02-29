const campaignService = require('../services/campaignService');
const campaignValidator = require('../validators/campaignValidator');

exports.getCampaignDetail = async (req, res, next) => {
    try {
        const campaignSlug = req.params.campaignSlug;
        const campaign = await campaignService.getCampaignDetail(campaignSlug);
        if (campaign) {
            return res.status(200).json({campaign});
        } 
        return res.status(404).json({ success: 'false', message: 'cannot find this campaign.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getAllByCategory = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAllByCategory(req);
        if (campaigns === false) {
            return res.status(400).json({ success: 'false', message: 'This category does not exist' });
        } 
        return res.status(200).json({ success: 'true', campaigns});
        // if (!campaigns)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getNewest = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getNewest(req);
        return res.status(200).json({ success: 'true', campaigns });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAll();
        return res.status(200).json({ success: 'true',campaigns });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getByRelation = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getHosted(req);
        return res.status(200).json({campaigns});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.createCampaign = async (req, res, next) => {
    try {
        let validator = await campaignValidator.createCampaignValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const campaign = await campaignService.create(req);
            if (campaign != false) {
                return res.status(201).json({ message: "success", campaign });
            } else {
                return res.status(400).json({ message: 'fail'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.createCampaignStep2 = async (req, res, next) => {
    try {
        const campaign = await campaignService.createCampaignStep2(req);
        if (campaign != false) {
            return res.status(200).json({ message: "success", campaign });
        } else {
            return res.status(400).json({ message: 'fail'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
    
}

exports.createCampaignStep3 = async (req, res, next) => {
    try {
        let validator = await campaignValidator.createCampaignStep3Validator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const campaign = await campaignService.createCampaignStep3(req);
            if (campaign != false) {
                return res.status(200).json({ message: "success", campaign });
            } else {
                return res.status(400).json({ message: 'fail'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
    
}