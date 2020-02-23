
const Category = require('../models').Category;
const { getAvailableCampaigns, createCampaign,
    getUserInfo, updateUserAddress, setUserBankAccount } = require('../services/frontEndService');

exports.getAvailableCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: {
                status: 'enable'
            }
        });
        console.log(categories);
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateUserAddress = async (req, res, next) => {
    try {
        const result = await updateUserAddress(req.body);
        console.log(result);
        if (result) {
            res.status(200).json({ message: 'Update User success' });
        } else {
            res.status(400).json({ message: 'Update User failed, please check your data' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getAvailableCampaigns = async (req, res, next) => {
    try {
        const campaigns = await getAvailableCampaigns();
        console.log(campaigns)
        res.status(200).json(campaigns);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.setBankAccount = async (req, res, next) => {
    try {
        await setUserBankAccount(req.body);
        res.status(200).json({ message: 'Set bank account successfully!' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getUserInfo = async (req, res, next) => {
    try {
        const user = await getUserInfo(req.body.userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.createCampaign = async (req, res, next) => {
    console.log('mèo méo meo')
    try {
        const result = await createCampaign(req.body);
        res.status(200).json({message: 'Create campaign successfully!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}