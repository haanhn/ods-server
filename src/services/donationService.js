const paypal = require('paypal-rest-sdk');
const randomstring = require('randomstring');
const env = require('dotenv').config();
const slug = require('slug');
// const dateFormat = require('dateFormat');
// const querystring = require('qs');
// const sha256 = require('sha256');
const axios = require("axios");

const url = "http://apilayer.net/api/live?access_key=795ffe55cd64ba290653c2cb689bf056&currencies=vnd&source=USD&format=1";

const config = require(__dirname + '/../config/vnpay.json');
const mailService = require('./mailService');
const Models = require('../models');
const followService = require('./followService');
const campaignService = require('./campaignService');
const authenticateService = require('./authenticateService');


paypal.configure({
    'mode': process.env.PAYPAL_MODE || 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID || 'client id',
    'client_secret': process.env.PAYPAL_CLIENT_SECRET || 'client secret'
});


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
    return await Models.Donation.findAll({
        where: {
            campaignId: campaign.id,
            donationStatus: status
        },
        include: [{
            model: Models.User,
            attributes: ['id', 'email', 'fullname', 'avatar']
        }]
    })
}

exports.getAllByUser = async (req) => {
    let userId = '';
    if (req.jwtDecoded) {
        userId = req.jwtDecoded.data.id
        return await Models.Donation.findAll({
            where: {
                userId: userId
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: Models.Campaign,
                attributes: ['id', 'campaignTitle', 'campaignSlug', 'campaignThumbnail']
            }]
        })
    } else {
        userId = req.params.userId;
        return await Models.Donation.findAll({
            where: {
                userId: userId,
                donationStatus: 'done',
                anonymous: 0
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: Models.Campaign,
                attributes: ['id', 'campaignTitle', 'campaignSlug', 'campaignThumbnail']
            }]
        })
    }

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
        include: [{
            model: Models.User,
            attributes: ['id', 'email', 'fullname', 'avatar']
        }]
    })
}

exports.createAsMember = async (req) => {
    const userId = req.body.userId;
    const email = req.body.email;
    const method = req.body.donation.method;
    const amount = req.body.donation.amount;
    const message = req.body.donation.message;
    const anonymous = req.body.donation.anonymous ? 1 : 0;
    const campaignId = req.body.campaignId;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    const noti = req.body.noti;
    if (noti) {
        await followService.follow(userId, campaignId, email);
    }

    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });

    if (campaign.campaignStatus != 'public') {
        return false;
    }

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
    const guestRole = await authenticateService.getRole('guest');

    const noti = req.body.noti;
    if (noti) {
        await followService.follow(null, campaignId, email, fullname);
    }

    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });

    if (campaign.campaignStatus != 'public') {
        return false;
    }

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
            roleId: guestRole.id,
        });
        userId = user.id
    }

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

exports.sendDonateMail = async (donation) => {
    const user = await Models.User.findByPk(donation.userId);
    const campaign = await Models.Campaign.findOne({
        where: {
            id: donation.campaignId
        },
        include: [{
            model: Models.User,
            attributes: ['id', 'email', 'fullname', 'address', 'regionId'],
            through: {
                where: {
                    relation: 'host'
                }
            }
        }]
    });
    const bankAccount = await Models.BankAccount.findOne({
        where: {
            userId: campaign.Users[0].id
        }
    })
    const hostRegion = await Models.Region.findOne({
        where: {
            id: campaign.Users[0].regionId
        }
    });
    const regionName = hostRegion ? hostRegion.name : '';
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    let amountFormated = donation.donationAmount + '';
    amountFormated = amountFormated.replace(regex, '.');
    const mail = {
        campaignTitle: campaign.campaignTitle,
        donor: {
            email: user.email,
            name: user.fullname
        },
        donation: {
            id: donation.id,
            amount: amountFormated,
            method: donation.donationMethod,
            trackingCode: donation.trackingCode
        },
        host: {
            id: campaign.Users[0].id,
            email: campaign.Users[0].email,
            name: campaign.Users[0].fullname,
            address: campaign.Users[0].address,
            region: regionName,
            accountName: bankAccount.accountName,
            accountNumber: bankAccount.accountNumber,
            bankName: bankAccount.bankName,
        }
    }
    // return mail;
    await mailService.confirmDonate(mail);
}

const closeCampaign = async (campaign) => {
    if (campaign.autoClose) {
        const raise = await campaignService.getRaise(campaign.id);
        if (raise >= campaign.campaignGoal && campaign.campaignStatus !== 'close') {
            // const waitingDonations = await Models.Donation.findAll({
            //     where: {
            //         campaignId: campaign.id,
            //         donationStatus: 'pending'
            //     }
            // })
            // if (waitingDonations.length === 0) {
            campaign.campaignStatus = 'close';
            campaign.success = true;
            await campaign.save();
            await this.sendCloseMail(campaign);
            // }
        }
    }
}

exports.hostUpdateStatusDonation = async (req) => {
    const action = req.params.action;
    const donationId = req.body.donationId;
    const userId = req.body.userId;

    const donation = await Models.Donation.findOne({
        where: {
            id: donationId
        }
    })
    if (!donation) {
        return 1;
    }
    const checkHost = await Models.UserCampaign.findOne({
        where: {
            campaignId: donation.campaignId,
            userId: userId,
            relation: 'host'
        }
    });
    if (!checkHost) {
        return 2;
    }
    if (action === 'approve') {
        donation.donationStatus = 'done';
    } else if (action === 'reject') {
        donation.donationStatus = 'reject';
    } else {
        donation.donationStatus = 'returned';
    }
    // action === 'approve' ? donation.donationStatus = 'done' : donation.donationStatus = 'reject';
    if (action === 'approve' || action === 'reject') {
        await this.sendUpdateStatusDonationMail(donation);
    }
    await donation.save();

    const campaign = await Models.Campaign.findOne({
        where: {
            id: donation.campaignId
        }
    })
    await closeCampaign(campaign);

    //Calculate ranking point of a campaign
    if (action === 'approve') {
        const raisedAmount = await campaignService.getRaise(campaign.id);
        const rankingPoint = campaignService.calculateCampaignRankingPoint(campaign, raisedAmount);
        campaign.rankingPoint = rankingPoint;
        await campaign.save();
    }

    return donation;
}

exports.sendUpdateStatusDonationMail = async (donation) => {
    const donor = await Models.User.findByPk(donation.userId);
    const campaign = await Models.Campaign.findByPk(donation.campaignId);
    let status;
    if (donation.donationStatus === 'done') {
        status = 'Xác nhận thành công';
    } else if (donation.donationStatus === 'reject') {
        status = 'Đã bị vô hiệu vì thông tin chuyển tiền không chính xác';
    }
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    let amountFormated = donation.donationAmount + '';
    amountFormated = amountFormated.replace(regex, '.');
    const mail = {
        campaignTitle: campaign.campaignTitle,
        donor: {
            email: donor.email,
            name: donor.fullname
        },
        donation: {
            id: donation.id,
            amount: amountFormated,
            method: donation.donationMethod,
            trackingCode: donation.trackingCode
        },
        status
    }
    await mailService.updateStatusDonation(mail);
}

exports.sendCloseMail = async (campaign) => {
    const listFollowers = await followService.getListFollowers(campaign.id);
    let listEmail = [];
    for (let follower of listFollowers) {
        const user = await Models.User.findOne({
            where: {
                id: follower
            }
        })
        listEmail.push(user.email);
    }
    const host = await campaignService.getHost(campaign.id);
    const raise = await campaignService.getRaise(campaign.id);
    const percent = raise / campaign.campaignGoal * 100;
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    let raiseFormated = raise + ''
    raiseFormated = raiseFormated.replace(regex, '.');
    let goalFormated = campaign.campaignGoal + '';
    goalFormated = goalFormated.replace(regex, '.');

    await mailService.sendCloseMail(listEmail, host, campaign.campaignTitle, raiseFormated, goalFormated, percent);
}

const getCurrencylayer = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.quotes.USDVND;
    } catch (error) {
        console.log(error);
    }
};

const create_payment_json = async (req) => {
    let rate = await getCurrencylayer(url);
    if (!rate) {
        rate = 23500;
    }
    // const reqAmount = Math.ceil(parseInt(req.body.amount) / rate);
    const amountRoundedStr = parseInt(req.body.amount) / rate;
    const amountToFixed = amountRoundedStr.toFixed(1);
    const reqAmount = parseFloat(amountToFixed);

    const amount = reqAmount + 1.5;
    const userId = req.body.userId || "";
    const campaign = await Models.Campaign.findByPk(req.body.campaignId);
    const message = req.body.message || "";
    const fullname = slug(req.body.fullname);
    const noti = req.body.noti;
    const email = req.body.email;
    console.log(fullname);
    return payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/api/donations/paypal/success?amount=" + req.body.amount + '&userId=' + userId + '&campaignId=' + campaign.id + '&fullname=' + fullname + '&noti=' + noti + '&email=' + email,
            "cancel_url": "http://localhost:5000/api/donations/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": campaign.campaignTitle,
                    "quantity": "1",
                    "price": reqAmount,
                    "currency": "USD"
                }, ]
            },
            "amount": {
                "total": amount,
                "currency": "USD",
                "details": {
                    "subtotal": reqAmount,
                    "handling_fee": "1.5"
                }
            },
            "description": message
        }]
    }
};

exports.createPayment = async (req, res) => {
    const payment_json = await create_payment_json(req);
    // console.log(payment_json);
    paypal.payment.create(payment_json, function (error, payment) {
        if (error) {
            console.log('error paypal');
            console.log(error);
            console.log(error.response.details);
            // throw error;
            res.status(500).json({
                message: 'Co loi paypal'
            })
        } else {
            console.log(payment);
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    // window.open(payment.links[i].href, '_blank');
                    // res.redirect( payment.links[i].href);
                    res.status(200).json({
                        url: payment.links[i].href
                    })
                }
            }
        }
    });
}

const execute_payment_json = async (req) => {
    const rate = await getCurrencylayer(url);
    const payerId = req.query.PayerID;
    console.log("execute_payment_json =>", payerId);
    // const reqAmount = Math.ceil(parseInt(req.query.amount) / rate);
    // const amount = reqAmount + 1.5;
    //-----
    const amountRoundedStr = parseInt(req.query.amount) / rate;
    const amountToFixed = amountRoundedStr.toFixed(1);
    const reqAmount = parseFloat(amountToFixed);
    const amount = reqAmount + 1.5;
    return payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": amount
            }
        }]
    }
};

exports.executePayment = async (req, res) => {
    const paymentId = req.query.paymentId;
    const payment_json = await execute_payment_json(req);
    const userId = req.query.userId;
    const campaignId = req.query.campaignId;
    const fullname = req.query.fullname;
    const email = req.query.email;
    const noti = req.query.noti;
    let user;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    const guestRole = await authenticateService.getRole('guest');
    // console.log(req.query);
    paypal.payment.execute(paymentId, payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            return false;
        } else {
            console.log(JSON.stringify(payment));
            if (userId) {
                // user = await Models.findByPk(userId);
                user = await Models.User.findOne({
                    where: {
                        id: userId
                    }
                });
            } else {
                user = await Models.User.findOne({
                    where: {
                        email: email
                    }
                });
                if (!user) {
                    user = await Models.User.create({
                        email: email,
                        password: '123456',
                        fullname: fullname.replace(/-/g, " "),
                        roleId: guestRole.id
                    })
                }
            }
            if (noti) {
                await followService.follow(user.id, campaignId, email, fullname);
            }
            const donation = await Models.Donation.create({
                userId: user.id,
                campaignId: campaignId,
                donationAmount: req.query.amount,
                donationMethod: "paypal",
                trackingCode: trackingCode,
                donationStatus: 'done',
                donationMessage: payment.transactions[0].description
            })
            await Models.CampaignTransaction.create({
                userId: user.id,
                campaignId: campaignId,
                donationId: donation.id,
                amount: req.query.amount,
                transactionType: "receive",
            });
            await this.sendDonateMail(donation);
            // const campaign = await Models.Campaign.findByPk(campaignId);
            // return true;
        }
        const campaign = await Models.Campaign.findOne({
            where: {
                id: campaignId
            }
        });
        try {
            await closeCampaign(campaign);
            //Calculate ranking point of a campaign
            const raisedAmount = await campaignService.getRaise(campaign.id);
            const rankingPoint = campaignService.calculateCampaignRankingPoint(campaign, raisedAmount);
            campaign.rankingPoint = rankingPoint;
            await campaign.save();
        } catch (error) {
            console.log(error);
        }
        res.redirect('http://127.0.0.1:3000/campaign/' + campaign.campaignSlug + '/paypal-complete');
    });
}



//host create outside donation
exports.hostCreate = async (req) => {
    const userId = req.jwtDecoded.data.id;
    const name = req.body.donation.name;
    const amount = req.body.donation.amount;
    const message = req.body.donation.message;
    const anonymous = req.body.donation.anonymous ? 1 : 0;
    const campaignId = req.body.campaignId;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });

    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });

    if (campaign.campaignStatus != 'public' && campaign.campaignStatus !== 'close') {
        return -1;
    }

    const host = await campaignService.getHost(campaign.id);
    if (host.id != userId) {
        return 0;
    }

    const donation = await Models.Donation.create({
        userId: userId,
        campaignId: campaignId,
        donationAmount: amount,
        donationMethod: 'outside',
        trackingCode: trackingCode,
        outsideDonor: name,
        anonymous: anonymous,
        donationStatus: 'done',
        donationMessage: message
    })
    try {
        await closeCampaign(campaign);
        //Calculate ranking point of a campaign
        const raisedAmount = await campaignService.getRaise(campaign.id);
        const rankingPoint = campaignService.calculateCampaignRankingPoint(campaign, raisedAmount);
        campaign.rankingPoint = rankingPoint;
        await campaign.save();
    } catch (error) {
        console.log(error);
    }
    return donation;
}

// function sortObject(o) {
//     var sorted = {},
//         key, a = [];

//     for (key in o) {
//         if (o.hasOwnProperty(key)) {
//             a.push(key);
//         }
//     }

//     a.sort();

//     for (key = 0; key < a.length; key++) {
//         sorted[a[key]] = o[a[key]];
//     }
//     return sorted;
// }