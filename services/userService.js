const User = require('../models').User;
const Campaign = require('../models').Campaign;
const campaignService = require('../services/campaignService');
const donationService = require('../services/donationService');

exports.findByEmail = async (req) => {
    const email = req.jwtDecoded.data.email;
    return await User.findOne({
        where: { email: email}
    })
};

exports.findById = async (req) => {
    const id = req.params.id;
    return await User.findOne({ 
        where: { id: id },
        attributes: {exclude: ['password', 'resetToken', 'resetTokenExpiration', 'rememberToken']}
    });
}

exports.updateUserAddress = async (req) => {
    const user = await this.findByEmail(req);
    user.address = req.body.address;
    user.region = req.body.region;
    return await user.save();
}

exports.updatePaypalAccount = async (req) => {
    const user = await this.findByEmail(req);
    user.paypal = req.body.paypal;
    return await user.save();
}

exports.getStats = async (req) => {
    const campaigns = await campaignService.getAllByUser(req);
    const donations = await donationService.getAllByUser(req);
    let countRaised  = 0;
    let countDonating = 0;
    for (let campaign of campaigns) {
        countRaised += await campaignService.getRaise(campaign.id);
    }
    for (let donation of donations) {
        countDonating += donation.donationAmount;
    }
    const result = {};
    result.countRaised = countRaised;
    result.countDonating = countDonating;
    return result;
}