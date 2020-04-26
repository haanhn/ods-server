const { Op, QueryTypes } = require('sequelize');
const Models = require('../models');
const db = require('../models/index');
const cron = require('node-cron');
const campaignService = require('../services/campaignService');

exports.getCampaignsByWeightSumPoint = async (viewingCampaignSlug, amountRequired) => {
    if (!amountRequired || amountRequired <= 0) {
        amountRequired = 4;
    }
    const viewingCampaign = await Models.Campaign.findOne({
        where: {
            campaignSlug: viewingCampaignSlug,
            campaignStatus: 'public'
        },
        include: [
            { model: Models.Category, attributes: ['id', 'categoryTitle'] }
        ]
    })
    if (!viewingCampaign) {
        return null;
    }
    const campaigns = await Models.Campaign.findAll({
        where: {
            id: {
                [Op.ne]: viewingCampaign.id
            },
            campaignStatus: 'public'
        },
        include: [
            { model: Models.Category, attributes: ['id', 'categoryTitle'] },
            { model: Models.Region, attributes: ['id', 'name'] }
        ]
    });
    let returnedCampaigns = [];
    if (campaigns && campaigns.length > 0) {
        const viewingTotalDays =
            this.calculateDaysBetweenDates(viewingCampaign.campaignStartDate, viewingCampaign.campaignEndDate);

        let i = 0;
        for (i = 0; i < campaigns.length; i++) {
            const campaign = campaigns[i];

            const totalDays = this.calculateDaysBetweenDates(campaign.campaignStartDate, campaign.campaignEndDate);

            const percentGoal = calculatePercentage(viewingCampaign.campaignGoal, campaign.campaignGoal);
            const percentDays = calculatePercentage(viewingTotalDays, totalDays);
            let sameCateogry = 0;
            if (campaign.Category.id === viewingCampaign.Category.id) {
                sameCateogry = 1;
            }

            const similarity = sameCateogry / 3 + percentGoal / 3 + percentDays / 3;

            const priority = 0.3 * similarity + 0.7 * campaign.rankingPoint;
            console.log('priority ' + priority);
            const raised = await campaignService.getRaise(campaign.id);
            returnedCampaigns.push({ ...campaign.dataValues, priority: priority, raise: raised });
        }
        returnedCampaigns.sort((a, b) => {
            return b.priority - a.priority;
        });
        returnedCampaigns = returnedCampaigns.slice(0, amountRequired);
    }
    return returnedCampaigns;
}

//Runs at 0:20 am to calculate user campaign match
cron.schedule('20 0 * * *', async () => {
    console.log('----------Start setting User Campaign Match----------');
    await this.setPredictCampaignPointForAllUsers();
    console.log('----------End setting User Campaign Match----------');
});

//Runs at 12:00 pm to calculate user campaign match
cron.schedule('0 12 * * *', async () => {
    console.log('----------Start setting User Campaign Match----------');
    await this.setPredictCampaignPointForAllUsers();
    console.log('----------End setting User Campaign Match----------');
});

exports.getCampaignsBySimilarUsers = async (currentUserId) => {
    const currentUser = Models.User.findOne({
        where: {
            id: currentUserId
        }
    });
    if (!currentUser) {
        return null;
    }

    const matches = await Models.UserCampaignMatch.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            { model: Models.Campaign }
        ],
        order: [
            ['matchPoint', 'DESC']
        ]
    });
    let i = 0;
    const campaignIds = []
    for (i = 0; i < matches.length; i++) {
        campaignIds.push(matches[i].campaignId);
    }
    const returnedCampaigns = await Models.Campaign.findAll({
        where: {
            id: {
                [Op.in]: campaignIds
            },
            campaignStatus: 'public'
        },
        include: [
            { model: Models.Category, attributes: ['id', 'categoryTitle'] },
            { model: Models.Region, attributes: ['id', 'name'] }
        ],
        order: [
            ['rankingPoint', 'DESC']
        ]
    });
    i = 0;
    for (i = 0; i < returnedCampaigns.length; i++) {
        const raised = await campaignService.getRaise(returnedCampaigns[i].id);
        returnedCampaigns[i].dataValues.raise = raised;
    }
    return returnedCampaigns;
}

//Calculate prediction matchpoint between user and campaign based on similar users
//Save to UserCampaignMatch
exports.setPredictCampaignPointForAllUsers = async () => {
    const from = new Date();

    const roles = await db.sequelize.query("SELECT id FROM ods_roles WHERE roleName in ('member', 'guest')",
        { type: QueryTypes.SELECT }
    );
    const roleIds = roles.map((role) => role.id);
    const users = await Models.User.findAll({
        where: {
            roleId: roleIds
        }
    });
    if (!users || users.length === 0) {
        return;
    }
    const donations = await db.sequelize.query("select userId, campaignId from ods_donations where donationStatus='done'",
        { type: QueryTypes.SELECT }
    );
    const userCampaigns = await db.sequelize.query("select userId, campaignId from ods_user_campaigns",
        { type: QueryTypes.SELECT }
    );
    const mapCampaigns = new Map();
    const mapUsers = new Map();
    getUserCampaign(donations, mapCampaigns, mapUsers);
    getUserCampaign(userCampaigns, mapCampaigns, mapUsers);

    const mapAllSims = new Map();
    let i = 0;
    for (i = 0; i < users.length; i++) {
        const currentUserId = users[i].id;
        const mapSim = getMapUserSimilarities2(currentUserId, mapUsers);
        mapAllSims.set(currentUserId, mapSim);
    }

    const mapAllPredicts = new Map();
    i = 0;
    for (i = 0; i < users.length; i++) {
        const currentUserId = users[i].id;
        const setCampaignsOfCurrentUser = mapUsers.get(currentUserId);

        console.log('setCampOfCurrentUser')
        console.log(setCampaignsOfCurrentUser)

        if (setCampaignsOfCurrentUser && setCampaignsOfCurrentUser.size > 0) {
            const mapSimOfCurrentUser = mapAllSims.get(currentUserId);
            if (mapSimOfCurrentUser && mapSimOfCurrentUser.size > 0) {
                const mapPredicts = getMapPredicts(currentUserId, mapCampaigns, mapUsers, mapSimOfCurrentUser);
                mapAllPredicts.set(currentUserId, mapPredicts);
            }
        }
    }

    await Models.UserCampaignMatch.destroy({ truncate: true });

    for (let [userId, mapPredicts] of mapAllPredicts) {
        console.log(userId);
        console.log(mapPredicts);
        
        // console.log('predictPoint--------------')
        for (let predict of mapPredicts) {
            // console.log('predict ' + predict)
            const campaignId = predict[0];
            let predictPoint = predict[1];
            if (Number.isNaN(predictPoint)) {
                predictPoint = 0;
            }
            // console.log('campaignId ' + campaignId)
            // console.log('predictPoint ' + predictPoint)

            await Models.UserCampaignMatch.create({
                userId, campaignId,
                matchPoint: predictPoint
            });
        }
    }

    const to = new Date();
    let between = (to.getTime() - from.getTime()) / 1000;

    console.log('Calculation user campaign match in: ' + between + ' seconds');
}

exports.calculateDaysBetweenDates = (fromDateStr, toDateStr) => {
    if (!fromDateStr || !toDateStr) {
        return -1;
    }
    try {
        const date1 = fromDateStr;
        const date2 = toDateStr;
        // const date1 = new Date(fromDateStr);
        // const date2 = new Date(toDateStr);
        const time1 = date1.getTime();
        const time2 = date2.getTime();
        const timeRange = time2 - time1;
        let days = timeRange / (1000 * 60 * 60 * 24);
        // console.log('Days = ' + days);
        if (days > 0 && days < 1) {
            days = 1;
        } else {
            days = Math.ceil(days);
        }
        // console.log('Days after = ' + days);
        return days;
    } catch (error) {
        return -1;
    }
}

const calculatePercentage = (amount1, amount2) => {
    if (amount1 <= 0 || amount2 <= 0) {
        return 0;
    }
    let percentage = 0;
    if (amount1 < amount2) {
        percentage = amount1 / amount2;
    } else {
        percentage = amount2 / amount1;
    }
    return percentage;
}

exports.getMapCampaignsRaisedAmount = async () => {
    // const campaignsRaisedAmount = await Models.Donation.findAll({
    //     attributes: [
    //         'campaignId',
    //         [sequelize.fn('sum', sequelize.col('donationAmount')), 'sumAmount'],
    //     ],
    //     group: ['campaignId'],
    //     raw: true
    // });
    const campaignsRaisedAmount = await db.sequelize.query(
        "select campaignId, sum(donationAmount) as 'sumAmount' from ods_donations where donationStatus='done' group by campaignId",
        {
            type: QueryTypes.SELECT
        });
    // console.log(campaignsRaisedAmount);
    const map = new Map();
    if (campaignsRaisedAmount && campaignsRaisedAmount.length > 0) {
        let i = 0;
        for (i = 0; i < campaignsRaisedAmount.length; i++) {
            const campaignRaised = campaignsRaisedAmount[i];
            // console.log(campaignRaised);
            map.set(campaignRaised.campaignId, campaignRaised.sumAmount);
        }
    }
    return map;
}

exports.getCampaignEmergency = (leftDays) => {
    if (!leftDays) {
        return 0;
    }
    let emergency = 0;
    if (leftDays <= 2) {
        emergency = 1;
    } else if (leftDays > 2 && leftDays <= 3) {
        emergency = 0.75;
    } else if (leftDays > 2 && leftDays <= 3) {
        emergency = 0.75;
    } else if (leftDays > 3 && leftDays <= 5) {
        emergency = 0.5;
    } else if (leftDays > 5 && leftDays <= 10) {
        emergency = 0.25;
    }
    return emergency;
}

const getUserCampaign = (list, mapCampaigns, mapUsers) => {
    let i = 0;
    for (i = 0; i < list.length; i++) {
        const item = list[i];
        const campaignId = item.campaignId;
        const userId = item.userId;

        //mapCampaigns
        let setUsers = mapCampaigns.get(campaignId);
        if (!setUsers) {
            setUsers = new Set();
        }
        setUsers.add(userId);
        mapCampaigns.set(campaignId, setUsers);

        //mapUsers
        let setCampaigns = mapUsers.get(userId);
        if (!setCampaigns) {
            setCampaigns = new Set();
        }
        setCampaigns.add(campaignId);
        mapUsers.set(userId, setCampaigns);
    }
}

const getMapUserSimilarities = (currentUserId, mapUsers) => {
    const mapSim = new Map();
    if (!mapUsers || mapUsers.length === 0) {
        return mapSim;
    }
    let i = 0;
    for (i = 0; i < mapUsers.size; i++) {
        mapUsers.forEach((value, key) => {
            if (key !== currentUserId) {
                const setCampaigns = value;
                const setCampaignsOfCurrentUser = mapUsers.get(currentUserId);
                let countCommonCampaigns = 0;
                for (campaignId of setCampaignsOfCurrentUser) {
                    if (setCampaigns.has(campaignId)) {
                        countCommonCampaigns++;
                    }
                }
                const similarity = countCommonCampaigns / (setCampaigns.size + setCampaignsOfCurrentUser.size - countCommonCampaigns);
                mapSim.set(key, similarity);
            }
        })

    }
    console.log('Similarity of user ith to current user:')
    console.log(mapSim);
    return mapSim;
}

const getMapUserSimilarities2 = (currentUserId, mapUsers) => {
    const mapSim = new Map();
    if (!mapUsers || mapUsers.length === 0) {
        return mapSim;
    }
    let i = 0;
    for (i = 0; i < mapUsers.size; i++) {
        mapUsers.forEach((value, key) => {
            if (key !== currentUserId) {
                const setCampaigns = value;
                const setCampaignsOfCurrentUser = mapUsers.get(currentUserId);
                if (setCampaignsOfCurrentUser && setCampaignsOfCurrentUser.size > 0) {

                    let countCommonCampaigns = 0;
                    for (campaignId of setCampaignsOfCurrentUser) {
                        if (setCampaigns.has(campaignId)) {
                            countCommonCampaigns++;
                        }
                    }
                    const similarity = countCommonCampaigns / (setCampaigns.size + setCampaignsOfCurrentUser.size - countCommonCampaigns);
                    mapSim.set(key, similarity);
                }
            }
        })
    }
    return mapSim;
}

const getMapPredicts = (currentUserId, mapCampaigns, mapUsers, mapSim) => {
    const mapPredicts = new Map();
    if (!mapCampaigns || mapCampaigns.length === 0) {
        return mapPredicts;
    }
    mapCampaigns.forEach((value, key) => {
        const campaignId = key;
        const following = mapUsers.get(currentUserId).has(campaignId);
        if (!following) {
            const setUserIds = value;
            let totalSim = 0;
            let commonUsers = 0;
            for (userId of setUserIds) {
                const common = mapUsers.get(userId).has(campaignId);
                if (common) {
                    totalSim = totalSim + mapSim.get(userId);
                    commonUsers++;
                }
            }
            if (totalSim > 0 && commonUsers > 0) {
                const predictPoint = totalSim / commonUsers;
                mapPredicts.set(campaignId, predictPoint);
            }
        }
    });
    return mapPredicts;
}

// exports.getCampaignsBySimilarUsers = async (currentUserId) => {
//     const currentUser = Models.User.findOne({
//         where: {
//             id: currentUserId
//         }
//     });
//     if (!currentUser) {
//         return null;
//     }
//     const donations = await db.sequelize.query(
//         "select distinct userId, campaignId from ods_donations where userId in(" +
//         "select userId from ods_donations where campaignId in (" +
//         "select campaignId from ods_donations where donationStatus='done' and userId='" + currentUserId + "'))",
//         {
//             type: QueryTypes.SELECT
//         });
//     const userCampaigns = await db.sequelize.query(
//         "select distinct userId, campaignId, relation from ods_user_campaigns where userId in(" +
//         "select userId from ods_user_campaigns where campaignId in (" +
//         "select campaignId from ods_user_campaigns where userId='" + currentUserId + "'))",
//         {
//             type: QueryTypes.SELECT
//         });
//     const mapCampaigns = new Map();
//     const mapUsers = new Map();
//     getUserCampaign(donations, mapCampaigns, mapUsers);
//     getUserCampaign(userCampaigns, mapCampaigns, mapUsers);

//     const mapSim = getMapUserSimilarities(currentUserId, mapUsers);
//     const mapPredicts = getMapPredicts(currentUserId, mapCampaigns, mapUsers, mapSim);
//     const predictCampaignIds = [];
//     mapPredicts.forEach((value, key) => {
//         predictCampaignIds.push(key);
//     })

//     const returnedCampaigns = await Models.Campaign.findAll({
//         where: {
//             id: {
//                 [Op.in]: predictCampaignIds
//             },
//             campaignStatus: 'public'
//         },
//         include: [
//             { model: Models.Category, attributes: ['id', 'categoryTitle'] }
//         ]
//     });
//     let i = 0;
//     for (i = 0; i < returnedCampaigns.length; i++) {
//         const raised = await campaignService.getRaise(returnedCampaigns[i].id);
//         returnedCampaigns[i].dataValues.raise = raised;
//     }
//     // console.log(predictCampaignIds)
//     // console.log('predicts');
//     // console.log(mapPredicts);
//     // console.log(donations);
//     // console.log(userCampaigns);
//     // console.log(mapCampaigns);
//     // console.log(mapUsers.size);
//     await this.getCampaignsBySimilarUsersForAllUsers();
//     return returnedCampaigns;
// }