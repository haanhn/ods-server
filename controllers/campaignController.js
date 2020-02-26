const { createCampaign, createCampaignStep2, createCampaignStep3} = require('../services/campaignService');
const { createCampaignValidator, createCampaignStep2Validator, createCampaignStep3Validator } = require('../validators/campaignValidator');

exports.createCampaign = async (req, res, next) => {
    try {
        let validator = await createCampaignValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const campaign = await createCampaign(req);
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
        let validator = await createCampaignStep2Validator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const campaign = await createCampaignStep2(req);
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

exports.createCampaignStep3 = async (req, res, next) => {
    try {
        let validator = await createCampaignStep3Validator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const campaign = await createCampaignStep3(req);
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