const Campaign = require('../models').Campaign;

exports.index = async (req, res, next) => {
  try {
    const listcampaigns = await Campaign.findAll();
    res.render('listcampaigns/index', {
      pageTitle: 'Admin - Campaigns',
      path: '/admin/listcampaigns',
      listcampaigns: listcampaigns,
      status: null
    });
  } catch (error) {
    console.log(error);
  }
};

exports.create = (req, res, next) => {
  res.render('listcampaigns/create', {
    pageTitle: 'Admin - Create Campaigns ',
    path: '/admin/listcampaigns'
  });
};

exports.getByStatus = async (req, res, next) => {
  const status = req.params.status;
  const campaigns = await Campaign.findAll({
    where: { campaignStatus: status }
  });
  res.render('listcampaigns/index', {
    pageTitle: 'Admin - Campaigns',
    path: '/admin/listcampaigns',
    listcampaigns: campaigns,
    status: status
  });
};
