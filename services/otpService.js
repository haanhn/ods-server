const randomstring = require('randomstring');
const { Op } = require('sequelize');

const User = require('../models').User;
const OTP = require('../models').OTP;
const {sendOTPMail} = require('./mailService')

const findUser = async (body) => {
    return await User.findOne({
        where: { email: body.user.email}
    })
};

const createRegisterOTP = async (body) => {
    const user = await findUser(body);
    const otpToken = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });

    if (user === null) {
        const otp = await OTP.create({
            otpToken: otpToken,
            email: body.user.email,
            expirate: Date.now() + 180000
        });
        await sendOTPMail(otp);
        return true;
    }
    return false;
}


const checkOTP = async (body) => {
    const otps = await OTP.findAll({
        where: {
            email: body.user.email,
            expirate: {
                [Op.gt]: Date.now()
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
    const otp = otps[0];
    if (!otp) {
        console.log('null');
        return false;
    } else {
        console.log(otp);
        if (otp.otpToken === body.otpToken) {
            return true;
        }
        return false;
    }
}



module.exports = { createRegisterOTP, checkOTP }