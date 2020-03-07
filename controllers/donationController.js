const donationService = require('../services/donationService');
const donationValidator = require('../validators/donationValidator');

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

exports.create = async (req, res, next) => {
    try {
        // console.log(req.body.userId);
        if (!req.body.userId) {
            //donate as guest
            let validator = await donationValidator.createDonationAsGuestValidator(req);
            if (validator !== null) {
                res.status(400).send({ message: validator });
            } else {
                const donation = await donationService.createAsGuest(req);
                if (donation) {
                        await donationService.sendMail(donation);
                    
                    // const test = await donationService.sendMail(donation);
                    return res.status(201).json({ success: 'true', message: "Donation created successfully", donation });
                } else {
                    return res.status(500).json({ error: 'Server Error' });
                }
            } 
        } else {
            //donate as member
            let validator = await donationValidator.createDonationAsMemberValidator(req);
            if (validator !== null) {
                res.status(400).send({ message: validator });
            } else {
                const donation = await donationService.createAsMember(req);

                if (donation) {
                        await donationService.sendMail(donation);
                    
                    return res.status(201).json({ success: 'true', message: "Donation created successfully", donation });
                } else {
                    return res.status(500).json({ error: 'Server Error' });
                }
            } 
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}