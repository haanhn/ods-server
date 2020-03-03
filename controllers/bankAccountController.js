const bankAccountService = require('../services/bankAccountService');
const bankAccountValidator = require('../validators/bankAccountValidator');

exports.find = async (req, res, next) => {
    try {
            const bankAccount = await bankAccountService.find(req);
            console.log(bankAccount);
            if (bankAccount) {
                return res.status(200).json({ success: 'true', bankAccount });
            } else {
                return res.status(404).json({ success: 'false', message: 'Cannot found'})
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const bankAccountList = await bankAccountService.findAll(req);
        return res.status(200).json({ success: 'true', bankAccountList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.create = async (req, res, next) => {
    try {
        const validator = await bankAccountValidator.createBankAccountValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const bankAccount = await bankAccountService.create(req);
            if (bankAccount) {
                return res.status(201).json({ success: 'true', message: "Bank account has been created successfully", bankAccount });
            } else {
                return res.status(500).json({ success: 'false', message: 'Server error'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.update = async (req, res, next) => {
    try {
        const validator = await bankAccountValidator.createBankAccountValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const result = await bankAccountService.update(req);
            if (result != false) {
                return res.status(200).json({ success: 'true', message: "Bank account has been updated successfully", result });
            } else {
                return res.status(404).json({ success: 'false', message: 'Bank account does not exist'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.delete = async (req, res, next) => {
    try {
        const validator = await bankAccountValidator.findBankAccountValidator(req);
        if (validator !== null) {
            res.status(400).send({ success: 'false', message: validator });
        } else {
            const result = await bankAccountService.destroy(req);
            if (result != false) {
                return res.status(200).json({ success: 'true', message: "Bank account has been deleted successfully", result });
            } else {
                return res.status(404).json({ success: 'false', message: 'Bank account does not exist'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}