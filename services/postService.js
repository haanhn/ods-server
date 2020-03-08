const Models = require('../models');

exports.checkHost = async (campaignId, userId) => {
    return await Models.UserCampaign.findOne({
        where: {
            campaignId: campaignId,
            userId: userId,
            relation: 'host'
        }
    });
}

exports.getAll = async (req) => {
    const campaignSlug = req.params.campaignSlug;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    })
    if (!campaign) {
        return 1;
    }
    return posts = await Models.Post.findAll({
        where: {
            campaignId: campaign.id,
            postStatus: 'enable'
        }
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
    const checkHost = await this.checkHost(campaign.id, reqUserId);
    //tim thay campaign nhung ko phai host return 2
    if (!checkHost) {
        return 2;
    }

    //tim thay campaign va la host return campaign donor
    return await Models.Post.findAll({
        where: {
            campaignId: campaign.id
        }
    })
}

exports.create = async (req) => {
    const campaignId = req.body.campaignId;
    const title = req.body.post.postTitle;
    const content = req.body.post.postContent;
    const reqUserId = req.jwtDecoded.data.id;

    const campaign = await Models.Campaign.findByPk(campaignId);
    if (!campaign) {
        return 1;
    }

    const checkHost = await this.checkHost(campaignId, reqUserId);
    if (!checkHost) {
        return 2;
    }
    return await Models.Post.create({
        postTitle: title,
        postContent: content,
        postStatus: 'enable',
        campaignId: campaign.id
    })
}

exports.update = async (req) => {
    const title = req.body.post.postTitle;
    const content = req.body.post.postContent;
    const status = req.body.post.postStatus;
    const postId = req.body.post.postId;

    return await Models.Post.update({
        postTitle: title,
        postContent: content,
        postStatus: status
    }, {
        where : {
            id: postId
        }
    })
}