const slug = require('slug');

const Models = require('../models');
const categoryService = require('../services/categoriesService');


exports.findBySlug = async (slug) => {
    return await Models.Campaign.findOne({ where: { campaignSlug: slug } });
}

exports.getCampaignDetail = async (slug) => {
    return await Models.Campaign.findOne({ 
        where: { 
            campaignSlug: slug 
        },
        include: [
            { model: Models.Category, attributes: [ 'categoryTitle' ] },
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ] }
        ]
    });
}

exports.getAll = async () => {
    return await Models.Campaign.findAll();
}

exports.getAllByCategory = async (req) => {
    const categorySlug = req.params.categorySlug;
    const category = await categoryService.findCategoryBySlug(categorySlug);
    return await category.getCampaigns();
}

// exports.getNewest = async (req) => {
//     const count = req.params.count;
//     return await Models.Campaign.
// }

exports.create = async (req) => {
    const user = req.jwtDecoded.data;
    const reqSlug = req.body.campaign.campaignSlug;
    const reqTitle = req.body.campaign.campaignTitle;
    const reqCategory = req.body.campaign.category;
    const reqShortDescription = req.body.campaign.campaignShortDescription;
    if (!reqSlug) {
        console.log('tao moi');
        const campaign = await Models.Campaign.create({
            campaignTitle: reqTitle,
            campaignSlug: slug(reqTitle),
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

