const donationService = require('../services/donationService');

exports.getAllByCampaign = async (req, res, next) => {
    try {
        const donations = await donationService.getAllByCampaignAndStatus(req, 'done');
        if (donations === false) {
            return res.status(400).json({ message: 'cannot find this campaign'})
        } else {
            return res.status(200).json({ message: "success", donations });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.hostGetAll = async (req, res, next) => {
    try {
        const donations = await donationService.hostGetAll(req);
        if (donations === 1) {
            return res.status(400).json({ message: 'cannot find this campaign'})
        } else {
            if (donations === 2) {
                return res.status(400).json({ message: 'you are not a host of this campaign'})
            } else {
                return res.status(200).json({ message: "success", donations });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}