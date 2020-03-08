const randomstring = require('randomstring');

const mailService = require('./mailService');
const Models = require('../models');
const { getRole } = require('./authenticateService');

exports.getAllByCampaignAndStatus = async (req, status) => {
    const campaignSlug = req.params.campaignSlug;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    });
    if (!campaign) {
        return false;
    }
    return  await Models.Donation.findAll({
        where: {
            campaignId: campaign.id,
            donationStatus: status
        },
        include: [
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ] }
        ]
    })
}

exports.hostGetAll = async (req) => {
    const campaignSlug = req.params.campaignSlug;
    const reqUserId = req.jwtDecoded.data.id;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    });
    //ko tim thay campaign return 1
    if (!campaign) {
        return 1;
    }
    const checkCampaign = await Models.UserCampaign.findOne({
        where: {
            campaignId: campaign.id,
            userId: reqUserId,
            relation: 'host'
        }
    });
    //tim thay campaign nhung ko phai host return 2
    console.log(checkCampaign);
    if (!checkCampaign) {
        return 2;
    }

    //tim thay campaign va la host return campaign donor
    return await Models.Donation.findAll({
        where: {
            campaignId: campaign.id
        },
        include: [
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ] }
        ]
    })
}

exports.createAsMember = async (req) => {
    const userId = req.body.userId;
    const method = req.body.donation.method;
    const amount = req.body.donation.amount;
    const message = req.body.donation.message;
    const anonymous = req.body.donation.anonymous ? 1 : 0;
    const campaignId = req.body.campaignId;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    return await Models.Donation.create({
        userId: userId,
        campaignId: campaignId,
        donationAmount: amount,
        donationMethod: method,
        trackingCode: trackingCode,
        anonymous: anonymous,
        donationStatus: 'pending',
        donationMessage: message
    })
}

exports.createAsGuest = async (req) => {
    const email = req.body.email;
    const fullname = req.body.fullname;
    const method = req.body.donation.method;
    const amount = req.body.donation.amount;
    const message = req.body.donation.message;
    const anonymous = req.body.donation.anonymous ? 1 : 0;
    const campaignId = req.body.campaignId;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    const role = await getRole('guest');
    let userId;
    const checkUser = await Models.User.findOne({
        where: {
            email: email
        }
    })

    if (checkUser) {
        userId = checkUser.id
    } else {
        const user = await Models.User.create({
            email: email,
            password: '123456',
            fullname: fullname,
            roleId: role.id,
        });
        userId = user.id
    }

    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    })

    
    return await Models.Donation.create({
        userId: userId,
        campaignId: campaignId,
        donationAmount: amount,
        donationMethod: method,
        trackingCode: trackingCode,
        anonymous: anonymous,
        donationStatus: 'pending',
        donationMessage: message
    })
}

exports.sendMail = async (donation) => {
    const user = await Models.User.findByPk(donation.userId);
    const campaign = await Models.Campaign.findOne({
        where: {
            id: donation.campaignId
        },
        include: [
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'address', 'region' ], through: { where: { relation: 'host' } } }
        ]
    });
    const bankAccount = await Models.BankAccount.findOne({
        where: {
            userId: campaign.Users[0].id
        }
    }) 
    if (donation.donationMethod === 'cash') {
        await mailService.sendToDonorDonateCashEmail(donation, user, campaign);
        await mailService.sendToHostDonateEmail(donation, user, campaign);
    } else if (donation.donationMethod === 'banking') {
        await mailService.sendToDonorDonateBankingEmail(donation, user, campaign, bankAccount);
        await mailService.sendToHostDonateEmail(donation, user, campaign);
    }
}

exports.hostUpdateStatusDonation = async (req) => {
    const action = req.params.action;
    const donationId = req.body.donationId;
    const donation = await Models.Donation.findOne({ 
        where: {
            id: donationId
        }
    })
    if(donation) {
        action === 'approve' ? donation.donationStatus = 'done' : donation.donationStatus = 'reject'
        return await donation.save();
    }
    return false;
}