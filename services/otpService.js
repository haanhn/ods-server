const randomstring = require('randomstring');

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
            email: body.user.email
        });
        await sendOTPMail(otp);
        return true;
    }
    return false;
}

const checkOTPExpirate =  (otp) => {
    const currentTimestamp = new Date().getTime();
    const otpTimestamp = otp.createdAt.getTime();
    if (currentTimestamp - otpTimestamp <= 300000) {
        return true;
    } else {
        return false;
    }
}


const checkOTP = async (body) => {
    const otps = await OTP.findAll({
        where: {
            email: body.user.email
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
    const otp = otps[0];
    console.log(otp);
    if (otp.otpToken === body.otpToken && checkOTPExpirate(otp) ) {
        return true;
    }
    return false;
}



module.exports = { createRegisterOTP, checkOTP }