const bcrypt = require('bcryptjs');

const User = require('../models').User;
const OTP = require('../models').OTP;
const { checkOTP } = require('./otpService')

const findUser = async (body) => {
    return await User.findOne({
        where: { email: body.user.email}
    })
};


const register = async (body) => {
    const checkUser = await findUser(body);
    if (checkUser == null) {
        bcrypt.hash(body.user.password, 10, async (err, hash) => {
            if (err) {
                console.log(err);
            }
            await User.create({
                email: body.user.email,
                password: hash,
                fullname: body.user.fullname
            })
        });
        return true;
    }
    return false;
}

const signIn = async (req) => {
    const user = await findUser(req.body);
    if (user == null) {
        return false;
    } else {
        const comparePassword = await bcrypt.compare(req.body.user.password, user.password);
        if (comparePassword == false) {
            return false;
        } else {
            req.session.user = user;
            return true;
        }
    }
}

const isLogging = async (req) => {
    if (req.session && req.session.user) {
        return true;
    } else {
        return false;
    }
}

module.exports = { register, signIn, isLogging }