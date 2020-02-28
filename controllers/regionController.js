const Region = require('../models').Region;

exports.getAll = async (req, res, next) => {
    const regions = await Region.findAll();
    if (regions) {
        return res.status(200).json({success: 'true', regions})
    }
    return res.status(404).json({success: 'false', message: 'No regions'});
}