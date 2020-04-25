const randomstring = require('randomstring');
const { Op } = require('sequelize');

const User = require('../models').User;
const OTP = require('../models').OTP;
const {sendOTP} = require('./mailService')

const findOTP = async (body) => {
    return await OTP.findOne({
        where: { email: body.user.email}
    })
};

// const findUser = async ()

const createRegisterOTP = async (body) => {
    const checkOtp = await findOTP(body);
    const otpToken = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });

    if (checkOtp === null) {
        const otp = await OTP.create({
            otpToken: otpToken,
            email: body.user.email,
            expirate: Date.now() + 180000
        });
        await sendOTP(otp);
    } else {
        checkOtp.update({
            otpToken: otpToken,
            expirate: Date.now() + 180000
        })
        await sendOTP(checkOtp);
    }
    return true; 
}


const checkOTP = async (body) => {
    const otp = await OTP.findOne({
        where: {
            email: body.user.email,
            expirate: {
                [Op.gt]: Date.now()
            }
        }
    });
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