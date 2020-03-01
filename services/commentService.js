const models = require('../models');

exports.create = async (req) => {
    const user = req.jwtDecoded.data;
    const comment = req.body.comment;
    const campaign = await models.Campaign.findOne({
        where: {
            id: req.body.campaign.id
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