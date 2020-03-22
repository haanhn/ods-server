const slug = require('slug');
const randomstring = require('randomstring');
const sequelize = require('sequelize');

const Models = require('../models');
const categoryService = require('../services/categoriesService');

//tim api theo slug
exports.findBySlug = async (slug) => {
    return await Models.Campaign.findOne({ where: { campaignSlug: slug } });
}

//lay tat ca campaign
exports.getAll = async () => {
    let campaigns = await Models.Campaign.findAll({
        include: [
            { model: Models.Category, attributes: [ 'categoryTitle' ] },
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ], through: { where: { relation: 'host' } } },
        ]
    });
    for (let campaign of campaigns){
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
        include: [
            { model: Models.Category, attributes: [ 'categoryTitle' ] },
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ], through: { where: { relation: 'host' } } }
        ]
    });

    for (let campaign of campaigns){
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
    let campaigns = await category.getCampaigns({ where: { campaignStatus: 'public' } });
    for (let campaign of campaigns){
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

//lay so luong nhat dinh (amount) campaign moi nhat
exports.getNewest = async (req) => {
    const count = Number(req.params.amount);
    console.log(count);
    let campaigns = await Models.Campaign.findAll({
        where: { campaignStatus: 'public' },
        order:[
            ["createdAt","DESC"]
        ],
        limit: count
    })
    for (let campaign of campaigns){
        const raise = await this.getRaise(campaign.id);
        campaign.dataValues.raise = raise;
    }
    return campaigns;
}

//lay tat ca nhung campaign ma minh lam host hoac supporter
exports.getByRelation = async (req) => {
    const relation = req.params.relation;
    console.log(relation);
    const reqUser = req.jwtDecoded.data;
    if (relation != 'host' && relation != 'supporter') {
        return false;
    }

    return await Models.User.findOne({
        where: {
            id: reqUser.id 
        },
        attributes: [ 'id','email', 'fullname', 'avatar' ],
        include: [
            { model: Models.Campaign, through: { where: { relation: relation } } }
        ]
    })
}

//lay ra detail cua 1 campaign + category + host theo slug
exports.getCampaignDetail = async (slug) => {
    return await Models.Campaign.findOne({ 
        where: { 
            campaignSlug: slug,
            campaignStatus: 'public'
        },
        include: [
            { model: Models.Category, attributes: [ 'categoryTitle' ] },
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar', 'region' ], through: { where: { relation: 'host' } } }
        ]
    });
}

exports.create = async (req) => {
    const user = req.jwtDecoded.data;
    const reqSlug = req.body.campaign.campaignSlug;
    const reqTitle = req.body.campaign.campaignTitle;
    const reqCategory = req.body.campaign.category;
    const reqShortDescription = req.body.campaign.campaignShortDescription;
    const random = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });

    if (!reqSlug) {
        console.log('tao moi');
        const campaign = await Models.Campaign.create({
            campaignTitle: reqTitle,
            campaignSlug: slug(reqTitle) + '-' + random,
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
            campaign.campaignSlug = slug(reqTitle) + '-' + random;
            campaign.categoryID = reqCategory;
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

    if (!reqSlug) {
        return false;
    } else {
        const campaign = await this.findBySlug(reqSlug);
        if (campaign != null) {
            campaign.campaignAddress = reqAddress;
            campaign.campaignRegion = reqCity;
            campaign.campaignGoal = reqGoal;
            campaign.campaignEndDate = reqEndDate;

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
                where: { campaignSlug: campaignSlug } 
            }
        );
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
    const random = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
    campaign.campaignTitle = req.body.campaign.campaignTitle;
    campaign.campaignSlug = slug(req.body.campaign.campaignTitle) + '-' + random,
    campaign.categoryId = req.body.campaign.categoryId;
    campaign.campaignShortDescription = req.body.campaign.campaignShortDescription;
    campaign.campaignDescription = req.body.campaign.campaignDescription;
    campaign.campaignThumbnail = req.body.campaign.campaignThumbnail;
    campaign.campaignAddress = req.body.campaign.campaignAddress;
    campaign.campaignRegion = req.body.campaign.campaignRegion;
    campaign.campaignEndDate = req.body.campaign.campaignEndDate;
    campaign.campaignGoal = req.body.campaign.campaignGoal;
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
    return campaign.save();
}

const sendCloseMail = async (campaignId) => {}