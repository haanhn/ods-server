const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))


const sendOTPMail = async (otp) => {
    try {
        await transporter.sendMail({
            to: otp.email,
            from: 'admin@loveus.com',
            subject: 'Register OTP Token',
            html: '<p>Here is your OTP: <b>' + otp.otpToken + '</b></p>'
        }) 
    } catch (error) {
        console.log(error);
    }
}


module.exports = { sendOTPMail }