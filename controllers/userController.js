const userService = require('../services/userService');
const userValidator = require('../validators/userValidator');

exports.getUserByEmail = async (req, res, next) => {
    const user = await userService.findByEmail(req);
    if (user) {
        return res.status(201).json({ success: "true", user });
    }
    return res.status(404).json({ success: 'false', message: 'cannot find user'});
}

exports.updateAddress = async (req, res, next) => {
    try {
        let validator = await userValidator.updateAddressValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const user = await userService.updateUserAddress(req);
            if (user) {
                return res.status(201).json({ success: "true", user });
            } else {
                return res.status(400).json({ success: 'false', message: 'fail in update user address'});
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

// exports.updatePaypal = async (req, res, next) => {
//     try {
//         const result = await userService.updatePaypalAccount(req);
//         if (result) {
//             return res.status(201).json({ success: "true", message: "user's Paypal account has been updated successfully", result });
//         } else {
//             return res.status(400).json({ success: 'false', message: 'fail in update user address'});
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Server Error' });
//     }
// }

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.findById(req);
        return res.status(200).json({ success: "true", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.getStats = async (req, res, next) => {
    try {
        const result = await userService.getStats(req);
        return res.status(200).json({ success: "true", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    } 
}

exports.update = async (req, res, next) => {
    try {
        // let validator = await userValidator.updateProfileValidator(req);
        // if (validator !== null) {
        //     res.status(400).send({ success: 'false', message: validator });
        // } else {
            const result = await userService.update(req);
            return res.status(201).json({ success: "true", message: "user's profile has been updated successfully", result });
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.updateAvatar = async (req, res, next) => {
    try {
        const result = await userService.updateAvatar(req);
        return res.status(201).json({ success: "true", message: "user's avatar has been updated successfully", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}