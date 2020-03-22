const campaignService = require('../services/campaignService');
const campaignValidator = require('../validators/campaignValidator');

exports.getCampaignDetail = async (req, res, next) => {
    try {
        const campaignSlug = req.params.campaignSlug;
        const campaign = await campaignService.getCampaignDetail(campaignSlug);
        if (campaign) {
            const raised = await campaignService.getRaise(campaign.id);
            const countDonations = await campaignService.getCountDonationsByCampaignId(campaign.id);
            return res.status(200).json({ success: 'true', message: 'get detail of campaign successfully', campaign, raised, countDonations});
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
        const campaigns = await campaignService.getByRelation(req);
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
};

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
};

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
};

exports.createCampaignStep5 = async (req, res, next) => {
    try {
        const campaign = await campaignService.createStep5(req);
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

exports.update = async (req, res, next) => {
    try {
        let validator = await campaignValidator.updateCampaign(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await campaignService.update(req);
            if (result === -1) {
                return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
            } else if (result === 0) {
                return res.status(400).json({ success: 'false', message: 'campaign has been closed, cannot update'})
            }
            return res.status(200).json({ success: 'true', message: "Campaign has been updated successfully", result });
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        const result = await campaignService.updateStatus(req);
        if (result === -1) {
            return res.status(400).json({ success: 'false', message: 'Only close this campaign'})
        } else if (result === 0) {
            return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
        }
        return res.status(200).json({ success: 'true', message: "Campaign has been updated successfully", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}