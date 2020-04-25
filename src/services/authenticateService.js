const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const { Op } = require('sequelize');

const User = require('../models').User;
const Role = require('../models').Role;
// const {resetToken} = require('./mailService')

const findUserByRole = async (body, role) => {
    console.log(role);
    const guestRole = await getRole(role);
    return await User.findOne({
        where: {
            email: body.user.email,
            roleId: guestRole.id
        }
    })
}

const getRole = async (roleName) => {
    return await Role.findOne({
        where: {
            roleName: roleName
        }
    });
}

const register = async (body) => {
    const checkMember = await findUserByRole(body, 'member');
    if (checkMember == null) {
        const checkGuest = await findUserByRole(body, 'guest');
        console.log(checkGuest);
        const memberRole = await getRole('member');
        const hash = bcrypt.hashSync(body.user.password, 10);
        if (checkGuest) {
            checkGuest.fullname = body.user.fullname;
            checkGuest.password = hash;
            roleId: memberRole.id
            await checkGuest.save();
        } else {
            await User.create({
                email: body.user.email,
                password: hash,
                fullname: body.user.fullname,
                roleId: memberRole.id
            });
        }
        return true;
    }
    return false;
}

const signIn = async (req) => {
    const user = await findUserByRole(req.body, 'member');
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

// const resetPassword = async (body) => {
//     const resetToken = randomstring.generate({
//         length: 6,
//         charset: 'numeric'
//     });
//     const user = await findUserByRole(body, 'member');
//     if (!user) {
//         console.log('ko tim thay');
//         return false;
//     } else {
//         user.resetToken = resetToken;
//         user.resetTokenExpiration = Date.now() + 180000;
//         await user.save();
//         await resetToken(user);
//         return true;
//     }
// }

// const newPassword = async (body) => {
//     let user = await User.findOne({
//         where: {
//             email: body.user.email,
//             resetToken: body. resetToken,
//             resetTokenExpiration: {
//                 [Op.gt]: Date.now()
//             }
//         }
//     })
//     if (!user) {
//         return false;
//     } else {
//         console.log(body.user.password);
//         bcrypt.hash(body.user.password, 10, async (err, hash) => {
//             if (err) {
//                 console.log(err);
//             }
//             user.password = hash;
//             user.resetToken = null;
//             user.resetTokenExpiration = null;
//             await user.save()
//         });
//         return true;
//     }
// }

// module.exports = { findUserByRole, register, signIn, isLogging, resetPassword, newPassword, getRole }
module.exports = { findUserByRole, register, signIn, isLogging, getRole }