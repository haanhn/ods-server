const paypal = require('paypal-rest-sdk');
const randomstring = require('randomstring');
const env = require('dotenv').config();
const slug = require('slug');
const dateFormat = require('dateFormat');
const querystring = require('qs');
const sha256 = require('sha256');



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

exports.getAllByUser = async (req) => {
    let userId = '';
    if(req.jwtDecoded){
        userId = req.jwtDecoded.data.id
        return await Models.Donation.findAll({
            where: {
                userId: userId
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                { model: Models.Campaign, attributes: [ 'id','campaignTitle', 'campaignSlug', 'campaignThumbnail' ]}
            ]
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
            include: [
                { model: Models.Campaign, attributes: [ 'id','campaignTitle', 'campaignSlug', 'campaignThumbnail' ]}
            ]
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
    await mailService.confirmDonate(mail);
}

const closeCampaign = async (campaign) => {
    if (campaign.autoClose) {
        const raise = await campaignService.getRaise(campaign.id);
        if (raise >= campaign.campaignGoal) {
            const waitingDonations = await Models.Donation.findAll({
                where: {
                    campaignId: campaign.id,
                    donationStatus: 'pending'
                }
            })
            if (waitingDonations.length === 0) {
                campaign.campaignStatus = 'close';
                await campaign.save();
                await this.sendCloseMail(campaign);
            }
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
    if(!checkHost) {
        return 2;
    }
    action === 'approve' ? donation.donationStatus = 'done' : donation.donationStatus = 'reject'
    await this.sendUpdateStatusDonationMail(donation);
    await donation.save();

    const campaign = await Models.Campaign.findOne({
        where: {
            id: donation.campaignId
        }
    })
    await closeCampaign(campaign);
    return donation;
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

exports.createPayment = async (req) => {
    const campaignId = req.body.campaignId || '';
    const fullname = req.body.fullname || '';
    const email = req.body.email || '';
    const message = req.body.message || '';
    const anonymous = req.body.anonymous;
    const noti = req.body.noti;

    console.log(typeof(email));
    console.log(typeof('cuongnv230796@gmail.com'));

    const ipAddr =  req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    const date = new Date();

    const createDate = dateFormat(date, 'yyyymmddHHmmss');
    const orderId = dateFormat(date, 'HHmmss');
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;

    let orderInfo= '';
    if (req.jwtDecoded) {
        orderInfo = req.jwtDecoded.data.id + "/" + campaignId + "/" + message + "/" + anonymous + "/" + noti;
    } else {
        orderInfo = email + "/" + fullname + "/" + campaignId + "/" + message + "/" + anonymous + "/" + noti;

    }
    // const orderInfo = email + '/' + fullname;
    const orderType = '250006';
    var locale = 'vn'
    const currencyCode = 'VND';
    let vnp_Params = {};

    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_CurrCode'] = currencyCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = secretKey + querystring.stringify(vnp_Params, { encode: false });


    const secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] = 'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
    return vnpUrl;
}

exports.paymentReturn = async (req) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;

    const signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    const sha256 = require('sha256');

    const checkSum = sha256(signData);
    console.log(vnp_Params);
    if(secureHash === checkSum) {
        const url = this.executePayment(vnp_Params);
        console.log(vnp_Params);
        return url;
    }
    return false;

}


exports.executePayment = async (vnp_Params) => {
    let userId;
    let email;
    let fullname
    let campaignId;
    let message;
    let anonymous;
    let noti;
    let user;
    let data = vnp_Params.vnp_OrderInfo.split('/');
    if (data.length === 5) {
        userId = data[0];
        campaignId = data[1];
        message = data[2];
        anonymous = data[3] === 'true' ? true : false;
        noti = data[4] === 'true' ? true : false;;
    } else {
      email = data[0];
      fullname = data[1];
      campaignId = data[2];
      message = data[3];
      anonymous = data[4] === 'true' ? true : false;;
      noti = data[5] === 'true' ? true : false;;

    }
    console.log('====================' + typeof(noti));
    console.log('====================' + typeof(anonymous));
    const guestRole = await authenticateService.getRole('guest');
    if (noti) {
        await followService.follow(userId, campaignId, email, fullname);
    }

    if (userId) {
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
                fullname: fullname,
                roleId: guestRole.id
            })
        }
    }
    const donation = await Models.Donation.create({
        userId: user.id,
        campaignId: campaignId,
        donationAmount: vnp_Params.vnp_Amount / 100,
        donationMethod: "vnpay",
        trackingCode: vnp_Params.vnp_TransactionNo,
        donationStatus: 'done',
        donationMessage: message,
        anonymous: anonymous
    })
    await this.sendDonateMail(donation);

    
    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });
    await closeCampaign(campaign);
    return 'http://localhost:3000/campaigns/' + campaign.campaignSlug;
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

    if (campaign.campaignStatus != 'public') {
        return -1;
    }

    const host = await campaignService.getHost(campaign.id);
    if (host.id != userId) {
        return 0;
    }

    return await Models.Donation.create({
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

}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}