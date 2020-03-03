const { Op } = require('sequelize');

const models = require('../models');

exports.create = async (req) => {
    const user = req.jwtDecoded.data;
    const comment = req.body.comment.content;
    const campaign = await models.Campaign.findOne({
        where: {
            id: req.body.campaign.id,
            [Op.or]: [
                { campaignStatus: 'public' },
                { campaignStatus: 'close' }
            ]
        }
    });
    if (!campaign) {
        return false;
    }
    return await models.Comment.create({
        content: comment,
        campaignId: campaign.id,
        userId: user.id
    })
}

exports.getAll = async (req) => {
    const campaignId = req.body.campaign.id;
    const campaign = await models.Campaign.findOne({
        where: {
            id: req.body.campaign.id
        }
    });
    if (campaign) {
        return await campaign.getComments({
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                { model: models.User, attributes: [ 'id','email', 'fullname', 'avatar', 'region' ] }
            ]
        });
    }
    return false;
}

exports.destroy = async (req) => {
    const userId = req.jwtDecoded.data.id;
    const commentId = req.params.commentId;
    const comment = await models.Comment.findOne({
        where: { 
            id: commentId,
            userId: userId
        }
    })
    if (comment) {
        return await comment.destroy();
    } 
    return false;
}