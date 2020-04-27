const slug = require('slug');
const randomstring = require('randomstring');
const {
    Op,
    QueryTypes
} = require('sequelize');
const cron = require('node-cron');

const db = require('../models/index');
const Models = require('../models');
const campaignSuggestService = require('../services/campaignSuggestService');
const categoryService = require('../services/categoriesService');
const mailService = require('./mailService');
const followService = require('./followService');
const donationService = require('./donationService');


// cron.schedule('10 * * * * *', async () => {
//     console.log('job chay');
//     const donations = await Models.Donation.findAll({
//         where: {
//             donationStatus: 'pending'
//         }
//     });
//     for (let donation of donations) {
//         console.log('===========Cron job==========', calculateDate(donation.createdAt));
//         if (calculateDate(donation.createdAt) === -7) {
//             const host = await this.getHost(donation.campaignId);
//             const campaign = await Models.Campaign.findOne({
//                 where: {
//                     id: donation.campaignId
//                 }
//             })
//             await mailService.notiDonation(host.email, null, donation, campaign);
//         } else if (calculateDate(donation.createdAt) === -10) {
//             donation.donationStatus = 'reject';
//             await donation.save();
//             const user = await Models.User.findByPk(donation.userId);
//             const host = await this.getHost(donation.campaignId);
//             const campaign = await Models.Campaign.findOne({
//                 where: {
//                     id: donation.campaignId
//                 }
//             })
//             await mailService.notiDonation(host.email, user.email, donation, campaign);
//         }
//     }
// })

const getMail = async (campaign, countDays) => {
    const email = {};
    const host = await this.getHost(campaign.id);
    const listFollowers = await followService.getListFollowers(campaign.id);
    const listFollowerEmails = [];
    for (let i = 0; i < listFollowers.length; i++) {
        const followerEmail = await Models.User.findOne({
            where: {
                id: listFollowers[i]
            },
            attributes: ['email']
        })
        listFollowerEmails.push(followerEmail.email);
    }
    console.log(countDays);
    email.host = host.email;
    email.campaign = campaign;
    email.followers = listFollowerEmails;
    email.countDays = countDays;
    // email.push({'host': host.email, 'campaign': campaign, 'followers': listFollowerEmails, "countDays": countDays});
    return email;
}
//chay moi ngay vao 00:05 am
//kiem tra campaign con 3 ngay la ket thuc thi gui mail bao cho host
//kiem tra den ngay ket thuc thi close chien dich
cron.schedule('5 0 * * *', async () => {
    console.log('job chay');
    const campaigns = await Models.Campaign.findAll({
        where: {
            campaignStatus: 'public',
            autoClose: 1,
        }
    })
    for (let campaign of campaigns) {
        console.log(calculateDate(campaign.endDate));
        let countDays = -1;
        if (calculateDate(campaign.endDate) === 1) {
            countDays = 1;
        } else if (calculateDate(campaign.endDate) === 3) {
            countDays = 3
        } else if (calculateDate(campaign.endDate) <= 0) {
            const raisedAmount = this.getRaise(campaign.id);
            campaign.campaignStatus = 'close';
            if (raisedAmount >= campaign.campaignGoal) {
                campaign.success = true;
            } else {
                campaign.success = false;
            }
            await campaign.save();
            email = await getMail(campaign.endDate, 0);
            countDays = 0;
        }
        if (countDays != -1) {
            const email = await getMail(campaign, countDays);
            await mailService.notiEndDate(email);
        }
    }

    const donations = await Models.Donation.findAll({
        where: {
            donationStatus: 'pending'
        }
    });
    for (let donation of donations) {
        if (calculateDate(donation.createdAt) === -7) {
            const host = await this.getHost(donation.campaignId);
            const campaign = await Models.Campaign.findOne({
                where: {
                    id: donation.campaignId
                }
            })
            await mailService.notiDonation(host.email, null, donation, campaign);
        } else if (calculateDate(donation.createdAt) === -10) {
            donation.donationStatus = 'reject';
            await donation.save();
            const user = await Models.User.findByPk(donation.userId);
            const host = await this.getHost(donation.campaignId);
            const campaign = await Models.Campaign.findOne({
                where: {
                    id: donation.campaignId
                }
            })
            await mailService.notiDonation(host.email, user.email, donation, campaign);
        }
    }
});

const getDateFromDatetime = datetime => {
    let date = datetime.getDate();
    let month = datetime.getMonth() + 1;
    const year = datetime.getFullYear();
    if (date.length === 1) {
        date = '0' + date;
    }
    if (month.length === 1) {
        month = '0' + month;
    }
    const returnDate = year + '-' + month + '-' + date;
    console.log('return date' + returnDate);
    return new Date(returnDate);
}

const calculateDate = (date) => {
    const currentDate = getDateFromDatetime(new Date())
    const checkDate = getDateFromDatetime(date);
    console.log('check date:' + checkDate);
    console.log('current date:' + currentDate);
    const one_day = 1000 * 60 * 60 * 24
    return (Math.ceil((checkDate - currentDate) / one_day));
}


exports.getHost = async (campaignId) => {
    const userCampaign = await Models.UserCampaign.findOne({
        where: {
            campaignId: campaignId,
            relation: 'host'
        }
    });
    return await Models.User.findOne({
        where: {
            id: userCampaign.userId
        },
        attributes: ['id', 'email', 'fullname']
    })
}

//tim api theo slug
exports.findBySlug = async (slug) => {
    return await Models.Campaign.findOne({
        where: {
            campaignSlug: slug
        }
    });
}

//lay tat ca campaign
exports.getAll = async () => {
    let campaigns = await Models.Campaign.findAll({
        include: [{
                model: Models.Category,
                attributes: ['categoryTitle']
            },
            {
                model: Models.User,
                attributes: ['id', 'email', 'fullname', 'avatar'],
                through: {
                    where: {
                        relation: 'host'
                    }
                }
            },
        ]
    });
    for (let campaign of campaigns) {
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

exports.getAllByStatus = async (status) => {
    let campaigns = await Models.Campaign.findAll({
        where: {
            campaignStatus: status
        },
        include: [{
                model: Models.Category,
                attributes: ['categoryTitle']
            },
            {
                model: Models.User,
                attributes: ['id', 'email', 'fullname', 'avatar'],
                through: {
                    where: {
                        relation: 'host'
                    }
                }
            },
            {
                model: Models.Region,
                attributes: ['id', 'name']
            }
        ],
        order: [
            ['rankingPoint', 'DESC']
        ]
    });

    for (let campaign of campaigns) {
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

//lay tat ca campaign theo category
exports.getAllByCategory = async (req) => {
    const categorySlug = req.params.categorySlug;
    const category = await categoryService.findCategoryBySlug(categorySlug);
    if (!category) {
        return false;
    }
    let campaigns = await category.getCampaigns({
        where: {
            campaignStatus: 'public'
        },
        include: [{
                model: Models.Category,
                attributes: ['categoryTitle']
            },
            {
                model: Models.Region,
                attributes: ['id', 'name']
            }
        ],
        order: [
            ['rankingPoint', 'DESC']
        ]
    });
    for (let campaign of campaigns) {
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

//lay tat ca campaign theo category
exports.searchCampaigns = async (req) => {
    const searchedValue = req.query.searchedValue;
    const campaigns = await db.sequelize.query(
        "SELECT * from ods_campaigns where MATCH (campaignTitle, campaignShortDescription) AGAINST ('" + searchedValue + "')" +
        " and campaignStatus='public' ORDER BY rankingPoint DESC", {
            type: QueryTypes.SELECT
        });
    const categories = await Models.Category.findAll();
    const regions = await Models.Region.findAll();
    const mapCategories = new Map();
    const mapRegions = new Map();
    if (categories && categories.length > 0) {
        for (let category of categories) {
            mapCategories.set(category.id, category);
        }
    }
    if (regions && regions.length > 0) {
        for (let region of regions) {
            mapRegions.set(region.id, region);
        }
    }
    for (let campaign of campaigns) {
        const raise = await this.getRaise(campaign.id);
        campaign.raise = raise;
        campaign.Category = mapCategories.get(campaign.categoryId);
        campaign.Region = mapRegions.get(campaign.regionId);
    }
    return campaigns;
}

//lay so luong nhat dinh (amount) campaign moi nhat
exports.getNewest = async (req) => {
    const count = Number(req.params.amount);
    console.log(count);
    let campaigns = await Models.Campaign.findAll({
        where: {
            campaignStatus: 'public'
        },
        order: [
            ["createdAt", "DESC"]
        ],
        limit: count
    })
    for (let campaign of campaigns) {
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

exports.getAllByUser = async (req) => {
    const userId = req.params.userId;
    let campaignIds = await Models.UserCampaign.findAll({
        where: {
            userId: userId,
            relation: 'host'
        },
        attributes: ['campaignId']
    });
    let campaigns = [];
    for (let i = 0; i < campaignIds.length; i++) {
        let campaign = await Models.Campaign.findOne({
            where: {
                id: campaignIds[i].campaignId,
                [Op.or]: [{
                        campaignStatus: 'public'
                    },
                    {
                        campaignStatus: 'close'
                    }
                ]
            },
            attributes: ['id', 'campaignTitle', 'campaignSlug', 'campaignThumbnail', 'campaignGoal'],
            include: [{
                model: Models.Category,
                attributes: ['categoryTitle']
            }]
        })
        if (campaign) {
            const raise = await this.getRaise(campaign.id);
            campaign.dataValues.raise = raise;
            campaigns.push(campaign);
        }
    }
    return campaigns;
}

//lay tat ca nhung campaign ma minh lam host hoac follower
exports.getByRelation = async (req) => {
    const relation = req.params.relation;
    console.log(relation);
    const reqUser = req.jwtDecoded.data;
    if (relation != 'host' && relation != 'follower') {
        return false;
    }

    return await Models.User.findOne({
        where: {
            id: reqUser.id
        },
        attributes: ['id', 'email', 'fullname', 'avatar'],
        include: [{
            model: Models.Campaign,
            through: {
                where: {
                    relation: relation
                }
            }
        }]
    })
}

//lay ra detail cua 1 campaign + category + host theo slug
exports.getCampaignDetail = async (slug) => {
    return await Models.Campaign.findOne({
        where: {
            campaignSlug: slug,
            campaignStatus: ['public', 'close']
        },
        include: [{
                model: Models.Category,
                attributes: ['categoryTitle']
            },
            {
                model: Models.User,
                attributes: ['id', 'email', 'fullname', 'avatar'],
                through: {
                    where: {
                        relation: 'host'
                    }
                },
                include: [{
                    model: Models.Region,
                    attributes: ['id', 'name']
                }]
            }
        ]
    });
}

exports.hostGetCampaignDetails = async (req) => {
    const slug = req.params.campaignSlug;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: slug
        },
        include: [{
            model: Models.Category,
            attributes: ['categoryTitle']
        }, ]
    });

    if (!campaign) {
        return null;
    }

    const id = campaign.id;
    const host = await this.getHost(id);
    console.log(host);
    console.log(req.jwtDecoded.data.id);
    if (host.id != req.jwtDecoded.data.id) {
        return -1;
    }
    return campaign;
}

exports.hostGetCampaignStats = async (req) => {
    const slug = req.params.campaignSlug;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: slug
        }
    });

    if (!campaign) {
        return 404;
    }

    const campaignId = campaign.id;
    const host = await this.getHost(campaignId);
    // console.log(host);
    // console.log(req.jwtDecoded.data.id);
    if (host.id !== req.jwtDecoded.data.id) {
        return 403; //forbidden
    }
    const raised = await this.getRaise(campaignId);
    const countDonations = await this.getCountDonationsByCampaignId(campaignId, 'done');
    const campaignStatus = campaign.campaignStatus;
    const result = {
        raised,
        countDonations,
        campaignStatus
    };
    return result;
}

exports.checkBeforeCreateCampaignByUserId = async (req) => {
    const user = req.jwtDecoded.data;
    const campaigns = await db.sequelize.query(
        "SELECT * FROM ods_campaigns WHERE campaignStatus IN ('setting', 'waiting') AND id IN " +
        "(SELECT campaignId FROM ods_user_campaigns WHERE userId = '" + user.id + "' AND relation = 'host')", {
            type: QueryTypes.SELECT
        }
    );
    // console.log(campaigns);
    if (campaigns.length > 0) {
        return campaigns[0];
    } else {
        return null;
    }
}

exports.create = async (req) => {
    const user = req.jwtDecoded.data;
    const reqSlug = req.body.campaign.campaignSlug;
    const reqTitle = req.body.campaign.campaignTitle;
    const reqCategory = req.body.campaign.category;
    const reqShortDescription = req.body.campaign.campaignShortDescription;
    const random = randomstring.generate({
        length: 10,
        charset: 'numeric'
    });
    const lowerCaseTitle = reqTitle.toLowerCase();
    if (!reqSlug) {
        console.log('tao moi');
        const campaign = await Models.Campaign.create({
            campaignTitle: reqTitle,
            campaignSlug: slug(lowerCaseTitle) + '-' + random,
            campaignShortDescription: reqShortDescription,
            categoryId: reqCategory
        });
        const userCampaign = await Models.UserCampaign.create({
            relation: 'host',
            userId: user.id,
            campaignId: campaign.id
        });
        return campaign;
    } else {
        console.log('update');
        const campaign = await this.findBySlug(reqSlug);
        if (campaign != null) {
            campaign.campaignTitle = reqTitle;
            campaign.campaignSlug = slug(lowerCaseTitle) + '-' + random;
            campaign.categoryId = reqCategory;
            campaign.campaignShortDescription = reqShortDescription;
            await campaign.save();

            return campaign;
        } else {
            console.log('ko tim thay slug');
            return false;
        }
    }
}

exports.createCampaignStep2 = async (req, res, next) => {
    const reqSlug = req.body.campaign.campaignSlug;
    const reqThumbnail = req.body.campaign.campaignThumbnail;
    const reqDescription = req.body.campaign.campaignDescription;
    if (!reqSlug) {
        return false;
    } else {
        const campaign = await this.findBySlug(reqSlug);
        if (campaign != null) {
            campaign.campaignThumbnail = reqThumbnail;
            campaign.campaignDescription = reqDescription;
            await campaign.save();
            return campaign;
        } else {
            console.log('ko tim thay slug');
            return false;
        }
    }
}

exports.createCampaignStep3 = async (req, res, next) => {
    const reqSlug = req.body.campaign.campaignSlug;
    const reqAddress = req.body.campaign.campaignAddress;
    const reqCity = req.body.campaign.campaignRegion;
    const reqGoal = req.body.campaign.campaignGoal;
    const reqEndDate = req.body.campaign.campaignEndDate;
    const autoClose = req.body.campaign.autoClose ? 'true' : 'false';

    if (!reqSlug) {
        return false;
    } else {
        const campaign = await this.findBySlug(reqSlug);
        if (campaign != null) {
            campaign.campaignAddress = reqAddress;
            campaign.regionId = reqCity;
            campaign.campaignGoal = reqGoal;
            campaign.campaignEndDate = reqEndDate;
            campaign.autoClose = autoClose;

            await campaign.save();
            return campaign;
        } else {
            console.log('ko tim thay slug');
            return false;
        }
    }
}

exports.createStep5 = async (req, res, next) => {
    const campaignSlug = req.body.campaign.campaignSlug;
    if (!campaignSlug) {
        return false;
    } else {
        const campaign = await Models.Campaign.findOne({
            where: {
                campaignSlug: campaignSlug
            }
        });
        if (campaign) {
            campaign.campaignStatus = 'waiting';
            return campaign.save();
        }
        return false;
    }
}

exports.getRaise = async (campaignId) => {
    return await Models.Donation.sum('donationAmount', {
        where: {
            campaignId: campaignId,
            donationStatus: 'done'
        }
    });
}

exports.getCountDonationsByCampaignId = async (campaignId, donationStatus) => {
    const status = donationStatus ? donationStatus : 'done';
    return await Models.Donation.count({
        where: {
            campaignId: campaignId,
            donationStatus: status
        }
    });
}

exports.update = async (req) => {
    const campaignId = req.body.campaign.id;
    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });
    if (!campaign) {
        return -1;
    }
    if (campaign.campaignStatus === 'close') {
        return 0;
    }
    campaign.campaignTitle = req.body.campaign.campaignTitle;
    campaign.categoryId = req.body.campaign.categoryId;
    campaign.campaignShortDescription = req.body.campaign.campaignShortDescription;
    campaign.campaignDescription = req.body.campaign.campaignDescription;
    campaign.campaignThumbnail = req.body.campaign.campaignThumbnail;
    campaign.campaignAddress = req.body.campaign.campaignAddress;
    campaign.regionId = req.body.campaign.campaignRegion;
    campaign.campaignEndDate = req.body.campaign.campaignEndDate;
    campaign.campaignGoal = req.body.campaign.campaignGoal;
    campaign.autoClose = req.body.campaign.autoClose ? 'true' : 'false'
    return campaign.save();
}

exports.updateStatus = async (req) => {
    const campaignId = req.body.campaignId;
    const status = req.body.status;
    if (status != 'close') {
        return -1;
    }
    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    });
    if (!campaign) {
        return 0;
    }
    campaign.campaignStatus = 'close';
    await donationService.sendCloseMail(campaign);
    return campaign.save();
}

cron.schedule('15 0 * * *', async () => {
    console.log('----------Start update campaigns ranking point----------');
    try {
        const campaigns = await Models.Campaign.findAll({
            where: {
                campaignStatus: 'public'
            }
        });
        const mapRaisedAmount = await campaignSuggestService.getMapCampaignsRaisedAmount();
        for (i = 0; i < campaigns.length; i++) {
            const campaign = campaigns[i];

            let raisedAmount = mapRaisedAmount.get(campaign.id);
            if (!raisedAmount) {
                raisedAmount = 0;
            }
            const rankingPoint = this.calculateCampaignRankingPoint(campaign, raisedAmount);
            await Models.Campaign.update({
                rankingPoint: rankingPoint
            }, {
                where: {
                    id: campaign.id
                }
            });
        }
    } catch (error) {
        console.error('Error when Scheduling update campaign ranking');
        console.error(error);
    }
    console.log('----------End update campaigns ranking point----------');
})

exports.calculateCampaignRankingPoint = (campaign, raisedAmount) => {
    if (!campaign) {
        return -1;
    }

    const goal = campaign.campaignGoal;
    const today = new Date();
    const totalDays = campaignSuggestService.calculateDaysBetweenDates(campaign.campaignStartDate, campaign.campaignEndDate);
    const runningDays = campaignSuggestService.calculateDaysBetweenDates(campaign.campaignStartDate, today);
    const leftDays = campaignSuggestService.calculateDaysBetweenDates(today, campaign.campaignEndDate);

    const minProgressAmount = (goal / totalDays) * runningDays;

    let progress = raisedAmount / minProgressAmount;
    if (progress > 1) {
        progress = 1;
    }
    const emergency = campaignSuggestService.getCampaignEmergency(leftDays);
    let rankingPoint = 0.4 * emergency + 0.6 * progress;
    if (emergency >= 0.75) {
        if (0.3 < progress && progress < 0.5) {
            rankingPoint = 0.3 * emergency + 0.7 * progress;
        } else if (progress <= 0.3) {
            rankingPoint = 0.2 * emergency + 0.8 * progress;
        }
    }
    if (Number.isNaN(rankingPoint)) {
        rankingPoint = 0;
    }
    return rankingPoint;
}