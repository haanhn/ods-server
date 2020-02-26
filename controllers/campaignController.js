const slug = require('slug');
const Campaign = require('../models').Campaign;
exports.index = async (req, res, next) => {
    try {
        const campaigns = await Campaign.findAll();
        res.render('campaign/index', {
            pageTitle: 'Admin - Campaign',
            path: '/admin/campaigns',
            campaigns: campaigns
        });
    } catch (error) {
        console.log(error);
    }
};
exports.create = (req, res, next) => {
    res.render('campaign/create', {
        pageTitle: 'Admin - Create Campaigns ',
        path: '/admin/campaigns',
        message: ''
    })
};
exports.store = async (req, res, next) => {
    const campaignTitle = req.body.campaignTitle;
    const campaignSlug = slug(campaignSlug);
    const campaignGoal = req.body.campaignGoal;
    const campaignEndDate = req.body.campaignEndDate;
    const campaignRatingPoint = req.body.campaignRatingPoint;
    const campaignShortDescription = req.body.campaignShortDescription;
    let status = req.body.status;
    if (!status) {
        status = 'disable';
    } else {
        status = 'enable';
    }
    try {
        let campaign = await Campaign.findOne({ where: { campaignSlug: campaignSlug } });
        if (!campaign) {
            campaign = await Campaign.create({
                campaignTitle: campaignTitle,
                campaignSlug: campaignSlug,
                campaignGoal: campaignGoal,
                campaignEndDate: campaignEndDate,
                campaignRatingPoint: campaignRatingPoint,
                campaignShortDescription: campaignShortDescription,
                status: status
            });
            // req.flash('success', 'Category được tạo thành công.');
            res.redirect('/admin/campaigns');
            // res.send(Swal.fire('sadsdsa'));

        } else {
            // req.flash('error', 'Category đã tồn tại.');
            res.render('campaign/create', {
                pageTitle: 'Admin - Create Campaign ',
                path: '/admin/campaigns',
                message: 'error'
            })

        }
    } catch (error) {
        console.log(error);
    }
};
exports.edit = async (req, res, next) => {
    const slug = req.params.campaignSlug;
    try {
        const campaign = await Campaign.findOne({ where: { campaignSlug: slug } });
        if (!campaign) {
            req.flash('error', 'Category không tồn tại.');
            res.redirect('/admin/campaigns');
        } else {
            res.render('campaigns/edit', {
                pageTitle: 'Admin - Edit campaigns ',
                path: '/admin/campaigns',
                campaign: campaign
            })

        }
    } catch (error) {
        console.log(error);
    }
};
exports.update = async (req, res, next) => {
    const campaignId = req.body.campaignId;
    const campaignTitle = req.body.campaignTitle;
    const campaignSlug = slug(campaignSlug);
    const campaignGoal = req.body.campaignGoal;
    const campaignEndDate = req.body.campaignEndDate;
    const campaignRatingPoint = req.body.campaignRatingPoint;
    const campaignShortDescription = req.body.campaignShortDescription;
    let status = req.body.status; 
    if (!status) {
        status = 'disable';
    } else {
        status = 'enable';
    }
    try {
        let campaign = await Campaign.findOne({ where: { id: campaignId } });
        let checked = await Campaign.findOne({ where: { campaignSlug: campaignSlug}});
        if(checked){
        if(checked.campaignSlug == campaign.campaignSlug){
            checked = null;
        }
    }
        // console.log(checked);
        if (campaign != null) {
            if(checked === null){
                campaign = await Campaign.update({
                    campaignTitle: campaignTitle,
                    campaignSlug: campaignSlug,
                    campaignGoal: campaignGoal,
                    campaignEndDate: campaignEndDate,
                    campaignRatingPoint: campaignRatingPoint,
                    campaignShortDescription: campaignShortDescription,
                    status: status
                        },{
                            where: {
                               id : campaignId
                            }
                        });     
            req.flash('success', 'Campaign được cập nhật thành công.');
            res.redirect('/admin/campaigns');
            }else{
                res.redirect('/admin/campaigns');
                
            }       
        } else {
            req.flash('error', 'Campaign existed.');
            res.redirect('/admin/campaigns');
        } 
    } catch (error) {
        console.log(error);
    }
};
exports.delete = async(req, res, next) => {
    const campaignId = req.params.id;
    try{
        let campaign =  await Campaign.findByPk(campaignId);
        if (campaign != null) {
            campaign.destroy(); 
            req.flash('success', 'Catogory được xóa thành công.');
            res.redirect('/admin/campaigns');        
        } else {
            req.flash('error', 'Role existed.');
            res.redirect('/admin/campaigns');
        }
    }catch(err){
        console.log(err);
    }
}