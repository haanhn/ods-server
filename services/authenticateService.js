const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const { Op } = require('sequelize');

const User = require('../models').User;
const {sendResetPasswordMail} = require('./mailService')

const findUser = async (body) => {
    return await User.findOne({
        where: { email: body.user.email}
    })
};


const register = async (body) => {
    const checkUser = await findUser(body);
    if (checkUser == null) {
        const hash = bcrypt.hashSync(body.user.password, 10);
        await User.create({
                email: body.user.email,
                password: hash,
                fullname: body.user.fullname
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

const resetPassword = async (body) => {
    const resetToken = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
    const user = await findUser(body);
    if (!user) {
        console.log('ko tim thay');
        return false;
    } else {
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 180000;
        await user.save();
        await sendResetPasswordMail(user);
        return true;
    }
}

const newPassword = async (body) => {
    let user = await User.findOne({
        where: {
            email: body.user.email,
            resetToken: body. resetToken,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    })
    if (!user) {
        return false;
    } else {
        console.log(body.user.password);
        bcrypt.hash(body.user.password, 10, async (err, hash) => {
            if (err) {
                console.log(err);
            }
            user.password = hash;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save()
        });
        return true;
    }
}

module.exports = { findUser, register, signIn, isLogging, resetPassword, newPassword }