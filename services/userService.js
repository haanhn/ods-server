const User = require('../models').User;
const BankAccount = require('../models').BankAccount;

const findUser = async (req) => {
    const email = req.jwtDecoded.data.email;
    return await User.findOne({
        where: { email: email}
    })
};

const findBankAccount = async (req) => {
    const accountNumber = req.body.bankAccount.accountNumber;
    return await BankAccount.findOne({ where: { 
        userId: req.jwtDecoded.data.id,
        accountNumber: accountNumber
    } });
}

const updateUserAddress = async (req) => {
    const user = await findUser(req);
    user.address = req.body.address;
    user.region = req.body.region;
    return await user.save();
}

const createBankAccount = async (req) => {
    const bankName = req.body.bankAccount.bankName;
    const bankAgency = req.body.bankAccount.bankAgency;
    const accountNumber = req.body.bankAccount.accountNumber;
    const bankAccount = await findBankAccount(req);
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

module.exports = { findUser, findBankAccount, updateUserAddress, createBankAccount }