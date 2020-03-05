const models = require('../../models');

exports.index = async (req, res, next) => {
    try {
        const users = await models.User.findAll();
        res.render('users/index', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
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
        res.render('users/details', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
            user: user
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
            attributes: [ 'id' ],
            include: [
                { model: models.Campaign, through: { where: { relation: "host" } } }
            ]
        });
        if (!user) {
            return res.redirect('/');
        }
        // return res.json({user});
        res.render('users/campaign-list', {
            pageTitle: 'Admin - Users',
            path: '/admin/users',
            user: user
        });
    } catch (error) {
        console.log(error);
    }
}