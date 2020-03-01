const User = require('../models').User;
const BankAccount = require('../models').BankAccount;

exports.find = async (req) => {
    const user = await User.findOne({ where: { id: req.jwtDecoded.data.id }});
    console.log('User ' +user);
    if (user) {
        const bankAccount = await BankAccount.findOne({ where: { 
            userId: req.jwtDecoded.data.id
        } });
        console.log('bank account ' + bankAccount);
        return bankAccount ? bankAccount : {};
    } else {
        return null;
    }
}

exports.findAll = async () => {
    return await BankAccount.findAll();
}

exports.create = async (req) => {
    const bankName = req.body.bankAccount.bankName;
    const bankAgency = req.body.bankAccount.bankAgency;
    const accountNumber = req.body.bankAccount.accountNumber;
    const bankAccount = await this.find(req);
    if (!bankAccount) {
        return await BankAccount.create({
            bankName: bankName,
            bankAgency: bankAgency,
            accountNumber: accountNumber,
            accountName: req.jwtDecoded.data.name,
            userId: req.jwtDecoded.data.id
        });
    }
    return false;
}

exports.update = async (req) => {
    const bankName = req.body.bankAccount.bankName;
    const bankAgency = req.body.bankAccount.bankAgency;
    const accountNumber = req.body.bankAccount.accountNumber;
    const bankAccount = await this.find(req);
    if (bankAccount) {
        bankAccount.bankName = bankName;
        bankAccount.bankAgency = bankAgency;
        bankAccount.accountNumber = accountNumber;
        bankAccount.accountName = req.jwtDecoded.data.name;
        bankAccount.userId = req.jwtDecoded.data.id;
        return await bankAccount.save();
    }
    return false;
}

exports.destroy = async (req) => {
    const bankAccount = await this.find(req);
    if (bankAccount) {
        return await bankAccount.destroy();
    }
    return false;
}
