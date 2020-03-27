const Models = require('../models');

const check = async (campaignId, userId) => {
    return result = await Models.UserCampaign.findOne({
        where: {
            userId: userId,
            campaignId: campaignId,
            relation: ['follower', 'host']
        }
    })
}

exports.checkFollowing = async (req) => {
    const reqUser = req.jwtDecoded.data;
    const campaignId = req.params.campaignId;
    return await check(campaignId, reqUser.id);
}

exports.getListFollowers = async (campaignId) => {
    const listFollowers = [];
    const followers = await Models.UserCampaign.findAll({ 
        where: {
            campaignId: campaignId,
            relation: 'follower',
        }
    });
    for (let follow of followers) {
        listFollowers.push(follow.userId);
    }
    return listFollowers;
}

exports.follow = async (req) => {
    let user;
    let userId = req.body.userId;
    const campaignId = req.body.campaignId;
    const email = req.body.email;
    const name = req.body.name || 'follower';
    if (!userId && !email) {
        return -1;
    }
    if (!userId) {
        user = await Models.User.findOne({ where: {
            email: email
        }});
        if (!user) {
            user = await Models.User.create({
                email: email,
                password: '123456',
                fullname: name,
                isMember: 0
            })
        }
        userId = user.id;
    }
    const checkFollowing = await check(campaignId, userId);
    if (checkFollowing) {
        return 0;
    }
    return await Models.UserCampaign.create({
        campaignId: campaignId,
        userId: userId,
        relation: 'follower'
    })
}

exports.unFollow = async (req) => {

}

exports.getCountFollowersByCampaignId = async (campaignId) => {
    return await Models.UserCampaign.count({
        where: {
            campaignId: campaignId,
            relation: ['follower', 'host']
        }
    });
}