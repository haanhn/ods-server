const Campaign = require('../models').Campaign;

exports.index = async (req, res, next) => {
  try {
    const listcampaigns = await Campaign.findAll();
    res.render('listcampaigns/index', {
      pageTitle: 'Admin - Campaigns',
      path: '/admin/listcampaigns',
      listcampaigns: listcampaigns
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
