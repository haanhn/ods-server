const User = require('../models').User;
const Campaign = require('../models').Campaign;
const campaignService = require('../services/campaignService');

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
    let countRaised  = 0;
    for (let campaign of campaigns) {
        console.log(campaign.raise);
        // countRaised += campaign.raise
    }
    return campaigns;
}