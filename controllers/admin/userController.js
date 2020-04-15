const {
    Op
} = require('sequelize');

const models = require('../../models');
const campaignService = require('../../services/campaignService');

exports.index = async (req, res, next) => {
    try {
        const users = await models.User.findAll({
            include: [
                { model: models.Region, attributes: ['id', 'name'] }
            ],
        });
        res.render('users/index', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
            admin: req.user,
            users: users
        });
    } catch (error) {
        console.log(error);
    }
}

exports.show = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await models.User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.redirect('/');
        }
        let campaignIds = await models.UserCampaign.findAll({
            where: {
                userId: user.id,
                relation: 'host'
            },
            attributes: ['campaignId']
        });
        let campaigns = [];
        let countRaised = 0;
        let countDonating = 0;
        for (let i = 0; i < campaignIds.length; i++) {
            let campaign = await models.Campaign.findOne({
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
                attributes: ['id'],
            })
            if (campaign) {
                campaigns.push(campaign);
            }
        }

        for (let campaign of campaigns) {
            countRaised += await campaignService.getRaise(campaign.id);
        }

        const donations = await models.Donation.findAll({
            where: {
                userId: user.id
            }
        });
        for (let donation of donations) {
            countDonating += donation.donationAmount;
        }
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        countRaised = countRaised + '';
        countDonating = countDonating + '';
        countRaised = countRaised.replace(regex, '.');
        countDonating = countDonating.replace(regex, '.');

        res.render('users/details', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
            admin: req.user,
            user: user,
            campaignCount: campaigns.length,
            countRaised: countRaised,
            countDonating: countDonating
        });
    } catch (error) {
        console.log(error);
    }
}

exports.showAllCampaignHosted = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await models.User.findOne({
            where: {
                id: userId
            },
            attributes: ['id'],
            include: [{
                model: models.Campaign,
                through: {
                    where: {
                        relation: "host"
                    }
                }
            }]
        });
        if (!user) {
            return res.redirect('/');
        }
        // return res.json({user});
        res.render('users/campaign-list', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
            admin: req.user,
            user: user
        });
    } catch (error) {
        console.log(error);
    }
}