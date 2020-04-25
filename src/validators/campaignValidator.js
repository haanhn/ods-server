const raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

exports.createCampaignValidator = async (req) => {
    req.check('campaign.campaignTitle', 'title is required.').not().isEmpty();
    req.check('campaign.category', 'category is required.').not().isEmpty();
    
    return raiseErr(req);
}

exports.createCampaignStep2Validator = async (req) => {
    req.check('campaign.campaignThumbnail', 'Thumbnail is required.').not().isEmpty();
    req.check('campaign.campaignDescription', 'Description is required.').not().isEmpty();
    
    return raiseErr(req);
}

exports.createCampaignStep3Validator = async (req) => {
    req.check('campaign.campaignAddress', 'Address is required.').not().isEmpty();
    req.check('campaign.campaignRegion', 'City is required.').not().isEmpty();
    req.check('campaign.campaignGoal', 'Goal is required.').not().isEmpty();
    req.check('campaign.campaignEndDate', 'End date is required.').not().isEmpty();
    
    return raiseErr(req);
}

exports.updateCampaign = async (req) => {
    req.check('campaign.campaignTitle', 'title is required.').not().isEmpty();
    req.check('campaign.categoryId', 'category is required.').not().isEmpty();
    // req.check('campaign.campaignThumbnail', 'Thumbnail is required.').not().isEmpty();
    req.check('campaign.campaignAddress', 'Address is required.').not().isEmpty();
    req.check('campaign.campaignRegion', 'City is required.').not().isEmpty();
    req.check('campaign.campaignGoal', 'Goal is required.').not().isEmpty();
    req.check('campaign.campaignEndDate', 'End date is required.').not().isEmpty();
    
    return raiseErr(req);
}
