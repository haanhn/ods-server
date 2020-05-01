const Models = require('../../models');
const donationService = require('../../services/donationService');
const campaignService = require('../../services/campaignService');


exports.index = async (req, res, next) => {
    try {
        const donations = await Models.Donation.findAll({
            where: {
                donationMethod: 'cash'
            },
            include: [{
                    model: Models.User,
                    attributes: ['fullname', 'address']
                },
                {
                    model: Models.Campaign,
                    attributes: ['campaignTitle']
                },
            ]
        });
        // res.send(donations);
        res.render('donations/index', {
            pageTitle: 'Admin - Donations',
            path: '/admin/donations',
            donations: donations,
            admin: req.user,
            status: null
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getByStatus = async (req, res, next) => {
    const status = req.params.status;
    const donations = await Models.Donation.findAll({
        where: {
            donationMethod: 'cash',
            donationStatus: status
        },
        include: [{
                model: Models.User,
                attributes: ['fullname', 'address']
            },
            {
                model: Models.Campaign,
                attributes: ['campaignTitle']
            },
        ]
    });
    res.render('donations/index', {
        pageTitle: 'Admin - Donations',
        path: '/admin/donations',
        donations: donations,
        admin: req.user,
        status: status
    });
};

exports.show = async (req, res, next) => {
    const id = req.params.donationId;
    const donation = await Models.Donation.findOne({
        where: {
            id: id
        },
        include: [{
                model: Models.User,
                attributes: ['fullname', 'address', 'phone', 'email']
            },
            {
                model: Models.Campaign,
                attributes: ['campaignTitle']
            },
        ]
    });
    // res.send(donation);
    res.render('donations/details', {
        pageTitle: 'Admin - Donations',
        path: '/admin/donations',
        admin: req.user,
        donation: donation,
    })
}

exports.rejectDonation = async (req, res, next) => {
    const id = req.params.donationId;
    const donation = await Models.Donation.findOne({
        where: {
            id: id,
        }
    });
    donation.donationStatus = 'reject';
    await donation.save();
    await donationService.sendUpdateStatusDonationMail(donation);
    res.redirect('/admin/donations');
}

exports.getApproveDonation = async (req, res, next) => {
    const id = req.params.donationId;
    const donation = await Models.Donation.findOne({
        where: {
            id: id,
        },
        include: [{
                model: Models.User,
                attributes: ['fullname', 'address', 'phone', 'email']
            },
            {
                model: Models.Campaign,
                attributes: ['campaignTitle']
            },
        ]
    });
    res.render('donations/approve', {
        pageTitle: 'Admin - Donations',
        path: '/admin/donations',
        admin: req.user,
        donation: donation,
    })
}

exports.postApproveDonation = async (req, res, next) => {
    //todo get image from form and send to api upload => received url.
    const url = 'abc';
    const id = req.body.donationId;

    const donation = await Models.Donation.findOne({
        where: {
            id: id
        }
    });
    donation.donationStatus = 'done';
    donation.description = url;
    await donation.save();
    await donationService.sendUpdateStatusDonationMail(donation);

    const campaign = await Models.Campaign.findOne({
        where: {
            id: donation.campaignId,
        },
    });
    await donationService.closeCampaign(campaign);

    //Calculate ranking point of a campaign
    const raisedAmount = await campaignService.getRaise(campaign.id);
    const rankingPoint = campaignService.calculateCampaignRankingPoint(campaign, raisedAmount);
    campaign.rankingPoint = rankingPoint;
    await campaign.save();

    res.redirect('/admin/donations');
}