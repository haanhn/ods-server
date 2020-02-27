const slug = require('slug');

const Campaign = require('../models').Campaign;
const UserCampaign = require('../models').UserCampaign;
const Category = require('../models').Category;
const { findUser } = require('../services/authenticateService');


const findCampaign = async (slug) => {
    return await Campaign.findOne({ where: { campaignSlug: slug } });
}

const createCampaign = async (req) => {
    const user = req.jwtDecoded.data;
    console.log(user);
    const reqSlug = req.body.campaign.campaignSlug;
    const reqTitle = req.body.campaign.campaignTitle;
    const reqCategory = req.body.campaign.category;
    const reqShortDescription = req.body.campaign.campaignShortDescription;
    if (!reqSlug) {
        console.log('tao moi');
        const campaign = await Campaign.create({
            campaignTitle: reqTitle,
            campaignSlug: slug(reqTitle),
            campaignShortDescription: reqShortDescription,
            categoryId: reqCategory
        });
        const userCampaign = await UserCampaign.create({
            relation: 'host',
            userId: user.id,
            campaignId: campaign.id
        });
        return campaign;
    } else {
        console.log('update');
        const campaign = await findCampaign(reqSlug);
        if (campaign != null) {
            campaign.campaignTitle = reqTitle;
            campaign.campaignSlug = slug(reqTitle);
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

const createCampaignStep2 = async (req, res, next) => {
    const reqSlug = req.body.campaign.campaignSlug;
    const reqThumbnail = req.body.campaign.campaignThumbnail;
    const reqDescription = req.body.campaign.campaignDescription;
    if (reqSlug === undefined) {
        return false;
    } else {
        const campaign = await findCampaign(reqSlug);
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

const createCampaignStep3 = async (req, res, next) => {
    const reqSlug = req.body.campaign.campaignSlug;
    const reqAddress = req.body.campaign.campaignAddress;
    const reqCity = req.body.campaign.campaignCity;
    const reqGoal = req.body.campaign.campaignGoal;
    const reqEndDate = req.body.campaign.campaignEndDate;

    if (reqSlug === undefined) {
        return false;
    } else {
        const campaign = await findCampaign(reqSlug);
        if (campaign != null) {
            campaign.campaignAddress = reqAddress;
            campaign.campaignCity = reqCity;
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

module.exports = { createCampaign, createCampaignStep2, createCampaignStep3 }