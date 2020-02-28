const User = require('../models').User;
const BankAccount = require('../models').BankAccount;

const findUser = async (req) => {
    const email = req.jwtDecoded.data.email;
    return await User.findOne({
        where: { email: email}
    })
};

const updateUserAddress = async (req) => {
    const user = await findUser(req);
    if (user) {
        user.address = req.body.address;
        user.regionId = req.body.regionId;
        await user.save();
        return true;
    }
    return false;
}

const createBankAccount = async (req) => {
    const user = await findUser(req);
    if (user) {
        user.address = req.body.address;
        user.regionId = req.body.regionId;
        await user.save();
        return true;
    }
    return false;
}

module.exports = { findUser, updateUserAddress }