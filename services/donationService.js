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
        await followService.follow(req);
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
        await followService.follow(req);
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
        where: { id: campaign.Users[0].regionId }
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
    action === 'approve' ? donation.donationStatus = 'done' : donation.donationStatus = 'reject';
    await this.sendUpdateStatusDonationMail(donation);
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
    const rate = await getCurrencylayer(url);
    const reqAmount = Math.ceil(parseInt(req.body.amount) / rate);
    const amount = reqAmount + 1.5;
    const userId = req.body.userId || "";
    const campaign = await Models.Campaign.findByPk(req.body.campaignId);
    const message = req.body.message || "";
    const fullname = slug(req.body.fullname);
    // const handleFee = 1.5 + (reqAmount * )
    console.log(fullname);
    return payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/api/donations/paypal/success?amount=" + req.body.amount + '&userId=' + userId + '&campaignId=' + campaign.id + '&fullname=' + fullname,
            "cancel_url": "http://localhost:5000/api/donations/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": campaign.campaignTitle,
                    "quantity": "1",
                    "price": reqAmount,
                    "currency": "USD"
                },]
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
            throw error;
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
    const reqAmount = Math.ceil(parseInt(req.query.amount) / rate);
    const amount = reqAmount + 1.5;
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
                        email: payment.payer.payer_info.email
                    }
                });
                if (!user) {
                    user = await Models.User.create({
                        email: payment.payer.payer_info.email,
                        password: '123456',
                        fullname: fullname.replace(/-/g, " "),
                        roleId: guestRole.id
                    })
                }
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
        res.redirect('http://localhost:3000/campaigns/' + campaign.campaignSlug);
    });
}

// exports.createPaymentVNPay = async (req) => {
//     const campaignId = req.body.campaignId || '';
//     const fullname = req.body.fullname || '';
//     const email = req.body.email || '';
//     const message = req.body.message || '';
//     const anonymous = req.body.anonymous;
//     const noti = req.body.noti;

//     console.log(typeof (email));
//     console.log(typeof ('cuongnv230796@gmail.com'));

//     const ipAddr = req.headers['x-forwarded-for'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;

//     const tmnCode = config.vnp_TmnCode;
//     const secretKey = config.vnp_HashSecret;
//     let vnpUrl = config.vnp_Url;
//     const returnUrl = config.vnp_ReturnUrl;

//     const date = new Date();

//     const createDate = dateFormat(date, 'yyyymmddHHmmss');
//     const orderId = dateFormat(date, 'HHmmss');
//     const amount = req.body.amount;
//     const bankCode = req.body.bankCode;

//     let orderInfo = '';
//     if (req.jwtDecoded) {
//         orderInfo = req.jwtDecoded.data.id + "/" + campaignId + "/" + message + "/" + anonymous + "/" + noti;
//     } else {
//         orderInfo = email + "/" + fullname + "/" + campaignId + "/" + message + "/" + anonymous + "/" + noti;

//     }
//     // const orderInfo = email + '/' + fullname;
//     const orderType = '250006';
//     var locale = 'vn'
//     const currencyCode = 'VND';
//     let vnp_Params = {};

//     vnp_Params['vnp_Version'] = '2';
//     vnp_Params['vnp_Command'] = 'pay';
//     vnp_Params['vnp_TmnCode'] = tmnCode;
//     vnp_Params['vnp_CurrCode'] = currencyCode;
//     vnp_Params['vnp_Locale'] = locale;
//     vnp_Params['vnp_TxnRef'] = orderId;
//     vnp_Params['vnp_OrderInfo'] = orderInfo;
//     vnp_Params['vnp_OrderType'] = orderType;
//     vnp_Params['vnp_Amount'] = amount * 100;
//     vnp_Params['vnp_ReturnUrl'] = returnUrl;
//     vnp_Params['vnp_IpAddr'] = ipAddr;
//     vnp_Params['vnp_CreateDate'] = createDate;
//     if (bankCode !== null && bankCode !== '') {
//         vnp_Params['vnp_BankCode'] = bankCode;
//     }

//     vnp_Params = sortObject(vnp_Params);

//     const signData = secretKey + querystring.stringify(vnp_Params, {
//         encode: false
//     });


//     const secureHash = sha256(signData);

//     vnp_Params['vnp_SecureHashType'] = 'SHA256';
//     vnp_Params['vnp_SecureHash'] = secureHash;
//     vnpUrl += '?' + querystring.stringify(vnp_Params, {
//         encode: true
//     });
//     return vnpUrl;
// }

// exports.paymentReturn = async (req) => {
//     let vnp_Params = req.query;
//     const secureHash = vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);

//     const tmnCode = config.vnp_TmnCode;
//     const secretKey = config.vnp_HashSecret;

//     const signData = secretKey + querystring.stringify(vnp_Params, {
//         encode: false
//     });

//     const sha256 = require('sha256');

//     const checkSum = sha256(signData);
//     console.log(vnp_Params);
//     if (secureHash === checkSum) {
//         const url = this.executePaymentVNPay(vnp_Params);
//         console.log(vnp_Params);
//         return url;
//     }
//     return false;

// }


// exports.executePaymentVNPay = async (vnp_Params) => {
//     let userId;
//     let email;
//     let fullname
//     let campaignId;
//     let message;
//     let anonymous;
//     let noti;
//     let user;
//     let data = vnp_Params.vnp_OrderInfo.split('/');
//     if (data.length === 5) {
//         userId = data[0];
//         campaignId = data[1];
//         message = data[2];
//         anonymous = data[3] === 'true' ? true : false;
//         noti = data[4] === 'true' ? true : false;;
//     } else {
//         email = data[0];
//         fullname = data[1];
//         campaignId = data[2];
//         message = data[3];
//         anonymous = data[4] === 'true' ? true : false;;
//         noti = data[5] === 'true' ? true : false;;

//     }
//     const guestRole = await authenticateService.getRole('guest');
//     if (noti) {
//         await followService.follow(userId, campaignId, email, fullname);
//     }

//     if (userId) {
//         user = await Models.User.findOne({
//             where: {
//                 id: userId
//             }
//         });
//     } else {
//         user = await Models.User.findOne({
//             where: {
//                 email: email
//             }
//         });
//         if (!user) {
//             user = await Models.User.create({
//                 email: email,
//                 password: '123456',
//                 fullname: fullname,
//                 roleId: guestRole.id
//             })
//         }
//     }
//     const donation = await Models.Donation.create({
//         userId: user.id,
//         campaignId: campaignId,
//         donationAmount: vnp_Params.vnp_Amount / 100,
//         donationMethod: "vnpay",
//         trackingCode: vnp_Params.vnp_TransactionNo,
//         donationStatus: 'done',
//         donationMessage: message,
//         anonymous: anonymous
//     })
//     await this.sendDonateMail(donation);


//     const campaign = await Models.Campaign.findOne({
//         where: {
//             id: campaignId
//         }
//     });
//     await closeCampaign(campaign);
//     return 'http://localhost:3000/campaigns/' + campaign.campaignSlug;
// }


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