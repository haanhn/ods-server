const fs = require('fs');

const cloudinary = require('../config/cloudinary');
const models = require('../models');

exports.uploadCampaignImage = async (req, res, next) => {
    const campaignSlug = req.params.campaignSlug;
    const reqUserId = req.jwtDecoded.data.id;
    try {
        if (!campaignSlug) {
            return res.status(400).json({ success: 'false', message: 'No provided campaign slug' });
        }
        const campaign = await models.Campaign.findOne({
            where: {
                campaignSlug: campaignSlug
            }
        })

        if(!campaign) {
            return res.status(400).json({ success: 'false', message: 'cannot find this campaign' });
        }

        const checkCampaign = await models.UserCampaign.findOne({
            where: {
                campaignId: campaign.id,
                userId: reqUserId,
                relation: 'host'
            }
        });

        if (!checkCampaign) {
            return res.status(403).json({ success: 'false', message: 'Your are not a host of campaign' });
        }

        const uploader = async (path) => await cloudinary.uploads(path, 'Images');
        
        const file = req.file;
            const { path } = file;
            const newPath = await uploader(path);
            campaign.campaignThumbnail = newPath.url;
            await campaign.save();
            fs.unlinkSync(path);

        return res.status(200).json({
            message: 'Campaign Thumbnail uploaded successfully',
            data: campaign
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.uploadSingle = async (req, res, next) => {
    try {
        const uploader = async (path) => await cloudinary.uploads(path, 'Images');
        const file = req.file;
        const { path } = file;
        const newPath = await uploader(path);
        fs.unlinkSync(path);

        return res.status(200).json({
            message: 'Image uploaded successfully',
            data: newPath
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}