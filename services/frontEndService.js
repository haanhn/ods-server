const slug = require("slug");

const { Op } = require("sequelize");

const Campaign = require('../models').Campaign;
const User = require('../models').User;
const UserCampaign = require('../models').UserCampaign;
const BankAccountInfo = require('../models').BankAccountInfo;

//campaignStatus = public or closed
const getAvailableCampaigns = () => {
    const campaigns = Campaign.findAll({
        where: {
            campaignStatus: {
                [Op.or]: ['public', 'closed']
            }
        }
    });
    return campaigns;
}

//update user address
const updateUserAddress = async (body) => {
    const result = await User.update({ address: body.address }, {
        where: { email: body.email }
    });
    return (result > 0);
}

const setUserBankAccount = async (body) => {
    // let body = {
    //     userId: "13d96397-7545-4061-b4b7-216c5a3b09be",
    //     bankAccount: {
    //         bankName: "Techcombank",
    //         bankAgency: null,
    //         accountName: "Nguyen Thi Ha Anh",
    //         accountNumber: "123498765"
    //     }
    // };
    const userId = body.userId;
    // const { bankName, bankAgency, accountName, accountNumber } = body.bankAccount;
    console.log('userIdd' + userId);
    const bankAccount = await BankAccountInfo.findOne({
        where: {
            userId: userId
        }
    });
    console.log('bank account ' + bankAccount);
    
    if (!bankAccount) {
        await BankAccountInfo.create({
            bankName: body.bankAccount.bankName,
            bankAgency: body.bankAccount.bankAgency,
            accountName: body.bankAccount.accountName,
            accountNumber: body.bankAccount.accountNumber,
            userId
        });
        return true;
    } else {
        await BankAccountInfo.update({
            bankName: bankName,
            bankAgency: bankAgency,
            accountName: accountName,
            accountNumber: accountNumber
        }, {
            where: { userId: userId }
        });
        console.log(`update bank account ` + updatedBankAccount);
    }
}

//get user and user bank account
const getUserInfo = async (userId) => {
    const user = await User.findOne({
        // where: { userId: userId }, 
        include: { 
            model: BankAccountInfo
        }
    });
    console.log(`user info ${user}`);
    return user;
} 

//create campaign
const createCampaign = async (body) => {
    const campaign = body.campaign;
    const userId = body.userId;
    const campaignSlug =  slug(campaign.title);
    const createdCampaign = await Campaign.create({
        campaignTitle: campaign.title,
        campaignSlug: campaignSlug,
        campaignGoal: campaign.goal,
        campaignEndDate: campaign.endDate,
        campaignShortDescription: campaign.shortDescription,
        campaignDescription: campaign.story,
        categoryId: campaign.category
    });
    console.log(`created campaign id: ${createdCampaign.id}`);
    const userCampaign = await UserCampaign.create({
        relation: 'host',
        userId: userId,
        email: 'ha@gmail.com',
        campaignId: createdCampaign.id
    });
    console.log(`user campagin: ${userCampaign.id}`);
    return ( userCampaign != null );
}

module.exports = { getAvailableCampaigns, createCampaign, getUserInfo, updateUserAddress, setUserBankAccount }