const { register, signIn, isLogging } = require('../services/authenticateService');
const { createRegisterOTP, checkOTP } = require('../services/otpService');

const OTP = require('../models').OTP;
const User = require('../models').User;

exports.sendOTP = async (req, res, next) => {
    try {
        const result = await createRegisterOTP(req.body);
        if (result) {
            res.status(200).send({ message: 'OTP has been sended successfully' });
        } else {
            res.status(400).send({ message: 'Email has been already used' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Server Error' });
    }
    
}

exports.register = async (req, res, next) => {
    try {
        const checkValidOTP = await checkOTP(req.body);
        if (checkValidOTP) {
            const createAccount = await register(req.body);
            if (createAccount) {
                res.status(200).send({ message: 'Your account created successfully' });
            } else {
                res.status(400).send({ message: 'Email has been already used' });
            }
        }else {
            res.status(400).send({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Server Error' });
    }
}


exports.login = async (req, res, next) => {
    try {
        const isLogged = await isLogging(req);
        if (isLogged === true) {
            return res.status(200).send({ message: 'You are logged in' });
        }
        const signIned = await signIn(req);
        if (signIned === false) {
            return res.status(400).send({ message: 'Invalid username or password' });
        } else {
            return res.status(200).send({ message: 'You are loggin successfull' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Server Error' });
    }
    
}