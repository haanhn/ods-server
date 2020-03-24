const Models = require('../models');

exports.getAll = async (req) => {
    const campaignSlug = req.params.campaignSlug;
    const campaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    })
    if (!campaign) {
        return false;
    }
    return expense = await Models.Expense.findAll({
        where: {
            campaignId: campaign.id
        }
    })
}

exports.create = async (req) => {
    const campaignId = req.body.campaignId || '';
    const title = req.body.expense.title;
    const cost = req.body.expense.cost;
    const description = req.body.expense.description || '';
    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    })
    if (!campaign) {
        return false;
    }
    return await Models.Expense.create({
        title: title,
        cost: cost,
        description: description,
        campaignId: campaign.id
    })
}

exports.update = async (req) => {
    const expenseId = req.body.expense.id;
    const title = req.body.expense.title;
    const cost = req.body.expense.cost;
    const description = req.body.expense.description || '';
    const expense = await Models.Expense.findOne({
        where: {
            id: expenseId
        }
    })
    if (!expense) {
        return false;
    }
    expense.title = title;
    expense.cost = cost;
    expense.description = description;
    return await expense.save();
}

exports.destroy = async (req) => {
    const expenseId = req.params.expenseId;
    const expense = await Models.Expense.findOne({
        where: {
            id: expenseId
        }
    })
    if (!expense) {
        return false;
    }
    return expense.destroy();
}