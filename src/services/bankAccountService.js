const User = require('../models').User;
const BankAccount = require('../models').BankAccount;

exports.find = async (req) => {
    // const user = await User.findOne({ where: { id: req.jwtDecoded.data.id } });
    // console.log('User ' + user);
    // if (user) {
       
    // } else {
    //     return null;
    // }
    const bankAccount = await BankAccount.findOne({
        where: {
            userId: req.jwtDecoded.data.id
        }
    });
    return bankAccount ? bankAccount : {};
}

exports.findAll = async () => {
    return await BankAccount.findAll();
}

exports.create = async (req) => {
    const bankName = req.body.bankAccount.bankName;
    const bankAgency = req.body.bankAccount.bankAgency;
    const accountNumber = req.body.bankAccount.accountNumber;
    const bankAccount = await this.find(req);
    console.log('create service bank account, ' + Object.keys(bankAccount).length);
   
        // no bank account yet ==> create
        if (Object.keys(bankAccount).length === 0) {
            return await BankAccount.create({
                bankName: bankName,
                bankAgency: bankAgency,
                accountNumber: accountNumber,
                accountName: req.jwtDecoded.data.name,
                userId: req.jwtDecoded.data.id
            });
        } else {
            //has a bank account ==> update
            bankAccount.bankName = bankName;
            bankAccount.bankAgency = bankAgency;
            bankAccount.accountNumber = accountNumber;
            bankAccount.accountName = req.jwtDecoded.data.name;
            bankAccount.userId = req.jwtDecoded.data.id;
            return await bankAccount.save();
        }
    
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
