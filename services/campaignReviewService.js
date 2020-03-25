const sequelize = require('sequelize');

const Models = require('../models');

const calculateRatingPoint = async (campaignId) => {
   const ratingPoint =  await Models.CampaignReview.findAll({
        where: {
            campaignId : campaignId
        }, 
        attributes: [[sequelize.fn('sum', sequelize.col('point')), 'total'], [sequelize.fn('count', sequelize.col('id')), 'count']],
        group : ['CampaignReview.campaignId'],
        raw: true,
   });
   return ratingPoint;
}

const findCampaign = async (campaignSlug) => {
    return await Models.Campaign.findOne({
        where: {
            campaignSlug: campaignSlug
        }
    })
}

exports.checkAllow = async (req) => {
    const user = req.jwtDecoded.data;
    const campaignSlug = req.params.campaignSlug;
    const campaign = await findCampaign(campaignSlug);
    const donation = await Models.Donation.findOne({
        where: {
            userId: user.id,
            campaignId: campaign.id,
            donationStatus: 'done'
        }
    })
    if (donation) {
        let userReviewStatus = 1;
        const review = await Models.CampaignReview.findOne({
            where: {
                userId: user.id,
                campaignId: campaign.id
            }
        });
        if (review) {
            userReviewStatus = 2;
        }
        return userReviewStatus;
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
    const campaignSlug = req.params.campaignSlug;
    const campaign = await findCampaign(campaignSlug);
    if (!campaign) {
        return false;
    }
    const reviews = await Models.CampaignReview.findAll({
        where: {
            campaignId: campaign.id
        }
    });
    // console.log(re)
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
    result.totalReviews = reviews.length;
    result.count1 = count1;
    result.count2 = count2;
    result.count3 = count3;
    result.count4 = count4;
    result.count5 = count5;
    return result;
}

exports.getAll = async (req) => {
    const campaignSlug = req.params.campaignSlug;
    const campaign = await findCampaign(campaignSlug);
    if (!campaign) {
        return false;
    }
    return reviews = await Models.CampaignReview.findAll({
        where: {
            campaignId: campaign.id
        },
        include: [
            { model: Models.User, attributes: [ 'id','email', 'fullname', 'avatar' ] } 
        ]
    })
}

exports.create = async (req) => {
    const campaignId = req.body.campaignId;
    const user = req.jwtDecoded.data;
    const point = req.body.review.point;
    const content = req.body.review.content;
    const campaign = await Models.Campaign.findOne({
        where: {
            id: campaignId
        }
    })
    if (!campaign) {
        return false;
    }
    let review = await Models.CampaignReview.findOne({
        where: {
            campaignId: campaign.id,
            userId: user.id
        }
    });
    
    if (review) {

        review.point = point;
        review.content = content;
        await review.save();
    } else {
        review =  await Models.CampaignReview.create({
            point: point,
            content: content,
            userId: user.id,
            campaignId: campaign.id
        })
    }
    const ratingPoint = await calculateRatingPoint(campaign.id);
    campaign.campaignRatingPoint = (parseInt(ratingPoint[0].total) / ratingPoint[0].count);
    await campaign.save();
    return review;
}

exports.destroy = async (req) => {
    const user = req.jwtDecoded.data;
    const reviewId = req.params.reviewId;
    const review = await Models.CampaignReview.findOne({
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