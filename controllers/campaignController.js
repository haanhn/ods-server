const campaignService = require('../services/campaignService');
const campaignValidator = require('../validators/campaignValidator');

exports.getCampaignDetail = async (req, res, next) => {
    try {
        const campaignSlug = req.params.campaignSlug;
        console.log(campaignSlug);
        const campaign = await campaignService.getCampaignDetail(campaignSlug);
        return res.status(200).json({campaign});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getAllByCategory = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAllByCategory(req);
        return res.status(200).json({campaigns});
        // if (!campaigns)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

// exports.getAll

exports.getAll = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAll();
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