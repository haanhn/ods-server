const User = require('../models').User;
const Campaign = require('../models').Campaign;
const BankAccount = require('../models').BankAccount;
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
        // attributes: {exclude: ['password', 'resetToken', 'resetTokenExpiration', 'rememberToken']}
        attributes: {exclude: ['password']}
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

exports.update = async (req) => {
    const fullname = req.body.user.fullname;
    const address = req.body.user.address;
    const region = req.body.user.region;
    const userId = req.jwtDecoded.data.id;

    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    const bankAccount = await BankAccount.findOne({
        where: {
            userId: user.id
        }
    })
    if (bankAccount) {
        bankAccount.accountName = fullname;
        bankAccount.save();
    }
    user.fullname = fullname;
    user.address = address;
    user.region = region;
    return user.save();
}

exports.updateAvatar = async (req) => {
    const userId = req.jwtDecoded.data.id;
    const avatarUrl = req.body.avatar;
    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    user.avatar = avatarUrl;
    return user.save();
}