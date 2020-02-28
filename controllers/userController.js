const { findUser, findBankAccount, createBankAccount, updateUserAddress} = require('../services/userService');
const { updateAddressValidator, createBankAccountValidator } = require('../validators/userValidator');

exports.getUser = async (req, res, next) => {
    const user = await findUser(req);
    if (user) {
        return res.status(201).json({ success: "true", user });
    }
    return res.status(400).json({ success: 'false', message: 'cannot find user'});
}

exports.updateAddress = async (req, res, next) => {
    try {
        let validator = await updateAddressValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const user = await updateUserAddress(req);
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

exports.createBankAccount = async (req, res, next) => {
    try {
        let validator = await createBankAccountValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const result = await createBankAccount(req);
            if (result != false) {
                return res.status(200).json({ message: "success", result });
            } else {
                return res.status(400).json({ success: 'false', message: 'Bank account has been already exist'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
    
}

