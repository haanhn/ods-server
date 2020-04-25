const expenseService = require('../services/expenseService');
const expenseValidator = require('../validators/expenseValidator');

exports.getAll = async (req, res, next) => {
    try {
        const result = await expenseService.getAll(req);
        if (result) {
            return res.status(200).json({ success: 'true', result});
        }
        return res.status(400).json({ success: 'fail', message: 'Cannot find this campaign'})
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.create = async (req, res, next) => {
    try {
        let validator = await expenseValidator.createValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await expenseService.create(req);
            if (result != false) {
                return res.status(201).json({ success: 'true', message: "Expense created successfully", result });
            } else {
                return res.status(400).json({ success: 'false', message: 'cannot find this campaign'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.update = async (req, res, next) => {
    try {
        let validator = await expenseValidator.updateValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await expenseService.update(req);
            if (result != false) {
                return res.status(201).json({ success: 'true', message: "Expense updated successfully", result });
            } else {
                return res.status(400).json({ success: 'false', message: 'cannot find this expense'})
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const result = await expenseService.destroy(req);
        if (result != false) {
            return res.status(201).json({ success: 'true', message: "Expense deleted successfully", result });
        } else {
            return res.status(400).json({ success: 'false', message: 'cannot find this expense'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}