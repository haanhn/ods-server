const paypal = require('paypal-rest-sdk');
const randomstring = require('randomstring');
const env = require('dotenv').config();
const slug = require('slug');

const mailService = require('./mailService');
const Models = require('../models');
const { getRole } = require('./authenticateService');


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

exports.sendDonateMail = async (donation) => {
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
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    let amountFormated = donation.donationAmount + '';
    amountFormated =amountFormated.replace(regex, '.');
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
            region: campaign.Users[0].region,
            accountName: bankAccount.accountName,
            accountNumber: bankAccount.accountNumber,
            bankName: bankAccount.bankName,
        }
    }
    // return mail;
    await mailService.sendToHostDonateEmail(mail);
    if (donation.donationMethod === 'cash') {
        await mailService.sendToDonorDonateCashEmail(mail);
    } else if (donation.donationMethod === 'banking') {
        console.log('gui mail banking roi ne');
        await mailService.sendToDonorDonateBankingEmail(mail);
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
    if(!checkHost) {
        return 2;
    }
    action === 'approve' ? donation.donationStatus = 'done' : donation.donationStatus = 'reject'
    await this.sendUpdateStatusDonationMail(donation);
    return await donation.save();
}

exports.sendUpdateStatusDonationMail = async (donation) => {
    const donor = await Models.User.findByPk(donation.userId);
    const campaign = await Models.Campaign.findByPk(donation.campaignId);
    let status;
    if (donation.donationStatus === 'done') {
        status = 'Xác nhận thành công' ;
    } else if (donation.donationStatus === 'reject') {
        status = 'Đã bị vô hiệu vì thông tin chuyển tiền không chính xác';
    }
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    let amountFormated = donation.donationAmount + '';
    amountFormated =amountFormated.replace(regex, '.');
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
    await mailService.sendUpdateStatusDonationMail(mail);
}

const create_payment_json = async (req) => {
    const amount = parseFloat(req.body.amount) + 1.5;
    const userId = req.body.userId || "";
    const campaign = await Models.Campaign.findByPk(req.body.campaignId);
    const message = req.body.message || "";
    const fullname = slug(req.body.fullname);
    console.log(fullname);
    return payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/api/donations/paypal/success?amount=" + amount + '&userId=' + userId + '&campaignId=' + campaign.id + '&fullname=' + fullname ,
            "cancel_url": "http://localhost:5000/api/donations/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [
                    {
                        "name": campaign.campaignTitle,
                        "quantity": "1",
                        "price": req.body.amount,
                        "currency": "USD"
                    },
                ]
            },
            "amount": {
                "total": amount,
                "currency": "USD",
                "details": {
                    "subtotal": req.body.amount,
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
            throw error;
        } else {
            console.log(payment);
            for (let i = 0; i < payment.links.length; i++){
                if (payment.links[i].rel === 'approval_url') {
                    // window.open(payment.links[i].href, '_blank');
                    // res.redirect( payment.links[i].href);
                    res.status(200).json({ url: payment.links[i].href })
                }
            }
        }
    });
}

const execute_payment_json = async (req) => {
    const payerId = req.query.PayerID;
    const amount = req.query.amount;
    console.log(req.query);
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
    let user;
    const trackingCode = randomstring.generate({
        length: 12,
        charset: 'numeric'
    });
    // console.log(req.query);
    paypal.payment.execute(paymentId, payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            return false;
        } else {
            console.log(JSON.stringify(payment));
            if (userId) {
                user = await Models.User.findOne({
                    where: {
                        id: userId
                    }
                });
            } else {
                user = await Models.User.findOne({
                    where: {
                        email: payment.payer.payer_info.email
                    }
                });
                if (!user) {
                    user = await Models.User.create({
                        email: payment.payer.payer_info.email,
                        password: '123456',
                        fullname: fullname.replace(/-/g, " "),
                        isMember: 0,
                    })
                }
            }
            const donation = await Models.Donation.create({
                userId: user.id,
                campaignId: campaignId,
                donationAmount: payment.transactions[0].amount.details.subtotal * 23000,
                donationMethod: "paypal",
                trackingCode: trackingCode,
                donationStatus: 'done',
                donationMessage: payment.transactions[0].description
            })
            await this.sendDonateMail(donation);
            // const campaign = await Models.Campaign.findByPk(campaignId);
            // return true;
        }
        const campaign = await Models.Campaign.findOne({
            where: {
                id: campaignId
            }
        });
        res.redirect('http://localhost:3000/campaigns/' + campaign.campaignSlug);
    });
}