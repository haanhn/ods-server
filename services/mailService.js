const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const templateMails = require('../templateMails/donationMailTempalte');

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

const sendResetPasswordMail = async (user) => {
    try {
        await transporter.sendMail({
            to: user.email,
            from: 'admin@loveus.com',
            subject: 'Reset password OTP Token',
            html: '<p>Here is your OTP token to reset password: <b>' + user.resetToken + '</b></p>'
        }) 
    } catch (error) {
        console.log(error);
    }
}

const sendToDonorDonateCashEmail = async (mail) => {
    try {
        const html = templateMails.sendToDonorDonateCashEmail(mail);
        await transporter.sendMail({
            to: mail.donor.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + mail.campaignTitle,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

const sendToHostDonateEmail = async (mail) => {
    let method = 'Chuyển khoản ngân hàng';
    if (mail.donation.donationMethod === 'cash') {
        method = 'Chuyển tiền mặt'
    }
    const html = templateMails.sendToHostDonateEmail(mail, method);
    try {
        await transporter.sendMail({
            to: mail.host.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + mail.campaignTitle,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

const sendToDonorDonateBankingEmail = async (mail) => {
    try {
        const html = templateMails.sendToDonorDonateBankingEmail(mail);
        await transporter.sendMail({
            to: mail.donor.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + mail.campaignTitle,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

const sendUpdateStatusDonationMail = async (mail) => {
    try {
        const html = templateMails.sendUpdateStatusDonationMail(mail);
        await transporter.sendMail({
            to: mail.donor.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + mail.campaignTitle,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

const sendUpdatePostMail = async (listEmail, title, slug) => {
    try {
        const html = templateMails.sendUpdatePostMail(title, slug);
        for (let i = 0; i < listEmail.length; i++) {
            await transporter.sendMail({
                to: listEmail[i],
                from: 'admin@loveus.com',
                subject: 'Cập nhật thông tin chiến dịch' + title,
                html: html
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { 
    sendOTPMail, 
    sendResetPasswordMail, 
    sendToDonorDonateCashEmail, 
    sendToHostDonateEmail, 
    sendToDonorDonateBankingEmail, 
    sendUpdateStatusDonationMail,
    sendUpdatePostMail, 
}