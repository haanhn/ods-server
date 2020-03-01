const Campaign = require('../../models').Campaign;
const campaignService = require('../../services/campaignService');

exports.index = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAll();
        console.log(campaigns);
        res.render('campaigns/index', {
            pageTitle: 'Admin - Campaigns',
            path: '/admin/campaigns',
            campaigns: campaigns,
            status: null
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getByStatus = async (req, res, next) => {
    const status = req.params.status;
    const campaigns = await campaignService.getAllByStatus(status)
    res.render('campaigns/index', {
        pageTitle: 'Admin - Campaigns',
        path: '/admin/campaigns',
        campaigns: campaigns,
        status: status
    });
};
