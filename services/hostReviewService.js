const sequelize = require('sequelize');

const Models = require('../models');

const calculateRatingPoint = async (hostId) => {
   const ratingPoint =  await Models.HostReview.findAll({
        where: {
            hostId : hostId
        }, 
        attributes: [[sequelize.fn('sum', sequelize.col('point')), 'total'], [sequelize.fn('count', sequelize.col('id')), 'count']],
        group : ['HostReview.hostId'],
        raw: true,
   });
   return ratingPoint;
}

const findHost = async (hostId) => {
    const checkHost = await Models.UserCampaign.findOne({
        where: {
            userId: hostId,
            relation: 'host'
        },
        attributes:[ 'userId']
    })
    if (checkHost) {
        return await Models.User.findOne({
            where: {
                id: checkHost.userId
            },
            attributes: {exclude: ['password', 'resetToken', 'resetTokenExpiration', 'rememberToken']}
        })
    }
    return false;
}

exports.checkAllow = async (req) => {
    const reviewer = req.jwtDecoded.data;
    const hostId = req.params.hostId;
    const userCampaigns = await Models.UserCampaign.findAll({
        where: {
            userId: hostId,
            relation: 'host'
        },
        attributes: ['campaignId']
    })
    let checkDonation = 0;
    // console.log(campaignIds)
    for (let i = 0; i < userCampaigns.length; i++) {
        const donation = await Models.Donation.findOne({
            where: {
                userId: reviewer.id,
                campaignId: userCampaigns[i].campaignId,
                donationStatus: 'done'
            }
        })
        if (donation) {
            checkDonation = 1;
        }
    }
    
    if (checkDonation === 1) {
        let hostReviewStatus = 1;
        const review = await Models.HostReview.findOne({
            where: {
                hostId: hostId,
                reviewerId: reviewer.id
            }
        });
        if (review) {
            hostReviewStatus = 0;
        }
        return hostReviewStatus;
    }
    return -1;

}

exports.getOverall = async (req) => {
    let result = {};
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    const hostId = req.params.hostId;
    const checkHost = await findHost(hostId);
    if (!checkHost) {
        return false;
    }
    const reviews = await Models.HostReview.findAll({
        where: {
            hostId: hostId
        }
    });
    // // console.log(re)
    for (let review of reviews) {
        console.log(review.point);
        switch (review.point) {
            case 1:
                count1++
                break;
            case 2:
                count2++
                break;
            case 3:
                count3++
                break;
            case 4:
                count4++
                break;
            case 5:
                count5++
                break;
            default:
                break;
        }
    }
    result.hostRatingPoint = checkHost.ratingPoint;
    result.totalReviews = reviews.length;
    result.count1 = count1;
    result.count2 = count2;
    result.count3 = count3;
    result.count4 = count4;
    result.count5 = count5;
    return result;
}

exports.getAll = async (req) => {
    const hostId = req.params.hostId;
    const checkHost = await findHost(hostId);
    if (!checkHost) {
        return false;
    }
    let reviews = await Models.HostReview.findAll({
        where: {
            hostId: checkHost.id
        }
    })
    for (let review of reviews) {
        const reviewer = await Models.User.findOne({ 
            where: {
                id: review.reviewerId
            },
            attributes: ['id', 'email', 'fullname', 'avatar']
        })
        review.dataValues.reviewer = reviewer;
    }
    return reviews;
}

exports.create = async (req) => {
    const hostId = req.body.hostId;
    const reviewer = req.jwtDecoded.data;
    const point = req.body.review.point;
    const content = req.body.review.content;
    const checkHost = await findHost(hostId);

    if (!checkHost) {
        return false;
    }

    let review = await Models.HostReview.findOne({
        where: {
            hostId: hostId,
            reviewerId: reviewer.id
        }
    });
    
    if (review) {
        review.point = point;
        review.content = content;
        await review.save();
    } else {
        review =  await Models.HostReview.create({
            point: point,
            content: content,
            reviewerId: reviewer.id,
            hostId: hostId
        })
    }
    const ratingPoint = await calculateRatingPoint(hostId);
    checkHost.ratingPoint = (parseInt(ratingPoint[0].total) / ratingPoint[0].count);
    await checkHost.save();
    return review;
}

exports.destroy = async (req) => {
    const user = req.jwtDecoded.data;
    const reviewId = req.params.reviewId;
    const review = await Models.HostReview.findOne({
        where: {
            id: reviewId,
            userId: user.id
        }
    })
    if (!review) {
        return false;
    }
    return review.destroy();
}