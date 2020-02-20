const { register, signIn, isLogging, resetPassword, newPassword } = require('../services/authenticateService');
const { createRegisterOTP, checkOTP } = require('../services/otpService');

const OTP = require('../models').OTP;
const User = require('../models').User;

exports.sendOTP = async (req, res, next) => {
    try {
        const result = await createRegisterOTP(req.body);
        if (result) {
            res.status(200).json({ message: 'OTP has been sended successfully' });
        } else {
            res.status(400).json({ message: 'Email has been already used' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
    
}

exports.register = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.login = async (req, res, next) => {
    try {
        const isLogged = await isLogging(req);
        if (isLogged === true) {
            return res.status(200).json({ message: 'You are logged in' });
        }
        const signIned = await signIn(req);
        if (signIned === false) {
            return res.status(400).json({ message: 'Invalid username or password' });
        } else {
            return res.status(200).json({ message: 'You are loggin successfull' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.logout = async (req, res, next) => {
    try {
        const isLogged = await isLogging(req);
        if (isLogged === false) {
            return res.status(400).json({ message: 'You are not logged in' });
        }
        req.session.user = null;
        return res.status(200).json({ message: 'You are logout successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error'});
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const result = await resetPassword(req.body);
        if (result === false) {
            return res.status(400).json({ message: 'Invalid email address' });
        } else {
            return res.status(200).json({ message: 'Reset OTP token has been seended successful'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error'});
    }
}


exports.newPassword = async (req, res, next) => {
    try {
        const result = await newPassword(req.body);
        console.log(result);
        if (result === false) {
            return res.status(400).json({ message: 'Invalid OTP token' });
        } else {
            return res.status(200).json({ message: 'Your password has been updated successful'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error'});
    }
}