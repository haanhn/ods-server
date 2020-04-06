const models = require('../../models');
const campaignService = require('../../services/campaignService');

exports.index = async (req, res, next) => {
    try {
        const campaigns = await campaignService.getAll();
        res.render('campaigns/index', {
            pageTitle: 'Admin - Campaigns',
            path: '/admin/campaigns',
            campaigns: campaigns,
            admin: req.user,
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
        admin: req.user,
        status: status
    });
};

exports.show = async (req, res, next) => {
    const slug = req.params.campaignSlug;
    const campaign = await models.Campaign.findOne({ 
        where: { 
            campaignSlug: slug
        },
        include: [
            { model: models.Category, attributes: [ 'categoryTitle' ] },
            { model: models.User, attributes: [ 'id','email', 'fullname', 'avatar' ], through: { where: { relation: 'host' } } }
        ]
    });
    res.render('campaigns/details', {
        pageTitle: 'Admin - Campaigns',
        path: '/admin/campaigns',
        admin: req.user,
        campaign: campaign,
    })
}

exports.campaignAction = async (req, res, next) => {
    const action = req.params.action;
    const campaignSlug = req.body.campaignSlug;
    
    const campaign = await models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    });
    
    if (campaign) {
        if (action === 'approve') {
            campaign.campaignStatus = 'public';
            const today = new Date();
            campaign.campaignStartDate = today;
            await campaign.save();
        } else {
            campaign.campaignStatus = 'block';
            await campaign.save();
        }
        return res.redirect('/admin/campaigns');    
    } else {
        return res.redirect('/admin/campaigns');    
    }
}
