const User = require('../models').User;
const BankAccount = require('../models').BankAccount;

exports.findByEmail = async (req) => {
    const email = req.jwtDecoded.data.email;
    return await User.findOne({
        where: { email: email}
    })
};

exports.updateUserAddress = async (req) => {
    const user = await findUser(req);
    user.address = req.body.address;
    user.region = req.body.region;
    return await user.save();
}