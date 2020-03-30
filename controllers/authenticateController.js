const { findUserByRole, register, signIn, isLogging, resetPassword, newPassword } = require('../services/authenticateService');
const { createRegisterOTP, checkOTP } = require('../services/otpService');
const { registerValidator, getOTPValidator, loginValidator, newPasswordValidatior } = require('../validators/authenticateValidator');
const jwtHelper = require('../helper/jwt.helper');
const OTP = require('../models').OTP;
const User = require('../models').User;

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '2h';
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-by-cuong-nv-a@';

exports.getOTP = async (req, res, next) => {
    try {
        let validator = await getOTPValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const user = await findUserByRole(req.body, 'member');
            if (user !== null) {
                res.status(400).json({ message: 'Email has been already used' });
            } else {
                const result = await createRegisterOTP(req.body);
                if (result == true) {
                    res.status(200).json({ message: 'OTP has been sended successfully' });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
    
}

exports.register = async (req, res, next) => {
    try {
        let validator = await registerValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const checkValidOTP = await checkOTP(req.body);
            if (checkValidOTP) {
                const createAccount = await register(req.body);
                if (createAccount) {
                    res.status(200).json({ message: 'Your account created successfully' });
                } else {
                    res.status(400).json({ message: 'Email has been already used' });
                }
            }else {
                res.status(400).json({ message: 'Invalid OTP' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.login = async (req, res, next) => {
    try {
        let validator = await loginValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            
            const isLogged = await isLogging(req);
            if (isLogged === true) {
                return res.status(200).json({ message: 'You are logged in' });
            }
            const signIned = await signIn(req);
            if (signIned === false) {
                return res.status(400).json({ message: 'Invalid username or password' });
            } else {
                //dung username va password
                //khoi tao token
                const user = await findUserByRole(req.body, 'member');
                const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
                const userInfo = {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname,
                    avatar: user.avatar,
                }
                res.status(200).json({ message: 'You are loggin successfull', accessToken, user: userInfo });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        let validator = await getOTPValidator(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await resetPassword(req.body);
            if (result === false) {
                res.status(400).json({ message: 'Invalid email address' });
            } else {
                res.status(200).json({ message: 'Reset OTP token has been seended successful'});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error'});
    }
}


exports.newPassword = async (req, res, next) => {
    try {
        let validator = await newPasswordValidatior(req);
        if (validator !== null) {
            res.status(400).send({ message: validator });
        } else {
            const result = await newPassword(req.body);
            console.log(result);
            if (result === false) {
                res.status(400).json({ message: 'Invalid OTP token' });
            } else {
                res.status(200).json({ message: 'Your password has been updated successful'});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error'});
    }
}