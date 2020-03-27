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

exports.getAllByUser = async (req, res, next) => {
    try {
        const result = await donationService.getAllByUser(req);
        return res.status(200).json({ success: 'true', result});
        // if (result === false) {
        //     return res.status(400).json({ message: 'cannot find this campaign'})
        // } else {
        //     return res.status(200).json({ message: "success", donations });
        // }
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
        if (!req.body.userId) {
            //donate as guest
            let validator = await donationValidator.createDonationAsGuestValidator(req);
            if (validator !== null) {
                res.status(400).send({ message: validator });
            } else {
                const donation = await donationService.createAsGuest(req);
                if (donation) {
                    await donationService.sendDonateMail(donation);
                    return res.status(201).json({ success: 'true', message: "Donation created successfully", donation });
                } else {
                    return res.status(400).json({ success: 'false', message: "campaign has been closed" });
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
                    await donationService.sendDonateMail(donation);
                    return res.status(201).json({ success: 'true', message: "Donation created successfully", donation });
                } else {
                    return res.status(400).json({ success: 'false', message: "campaign has been closed"});
                }
            } 
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.hostUpdateDonationStatus = async (req, res, next) => {
    const action = req.params.action;
    try {
        if (action != 'reject' && action != 'approve') {
            return res.status(400).json({ success: 'false', message: 'action does not allowed. Please send approve or reject.' });
        }
        const result = await donationService.hostUpdateStatusDonation(req);
        if (result === 1) {
            return res.status(400).json({ success: 'false', message: 'Cannot find this donation.' });
        }
        if (result === 2) {
            return res.status(400).json({ success: 'false', message: 'You are not a host of this campaign.' });
        }
        return res.status(200).json({ success: 'true', message: 'Update donation status successfully.', result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.hostUpdateDonationStatusViaEmail = async (req, res, next) => {
    const action = req.params.action;
    try {
        if (action != 'reject' && action != 'approve') {
            return res.status(400).json({ success: 'false', message: 'action does not allowed. Please send approve or reject.' });
        }
        const result = await donationService.hostUpdateStatusDonation(req);
        if (result === 1) {
            return res.status(400).json({ success: 'false', message: 'Cannot find this donation.' });
        }
        if (result === 2) {
            return res.status(400).json({ success: 'false', message: 'You are not a host of this campaign.' });
        }
        return res.status(200).json({ success: 'true', message: 'Update donation status successfully.' });
        //sau nay co url cua fe thi se redirect ve trang chu
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.createPayment = async (req, res, next) => {
    try {
        await donationService.createPayment(req, res);
        // console.log(url);
        // return res.redirect(url);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.executePayment = async (req, res, next) => {
    try {
        await donationService.executePayment(req, res);
        // if ( result) {
        //     res.redirect('http://localhost:5000/api/campaign/get-detail/Giai-cuu-dua-hau-giup-ba-con-nong-dan-447425');
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

//host tao outside donation
exports.hostCreate = async (req, res, next) => {
    try {
        let validator = await donationValidator.hostCreateDonationValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await donationService.hostCreate(req);
            if (result === -1) {
                return res.status(400).json({ success: 'false', message: "campaign has been closed" });
            } else if (result === 0) {
                return res.status(400).json({ success: 'false', message: "You are not a host of this campaign" });
            } else {
                return res.status(201).json({ success: 'true', message: "Donation created successfully", result });
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}
