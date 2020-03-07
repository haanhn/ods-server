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

const sendToDonorDonateCashEmail = async (donation, user, campaign) => {
    try {
        await transporter.sendMail({
            to: user.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + campaign.campaignTitle,
            html: '<p>Cam on '+ user.fullname +'</p><p>Cam on ban da quyen gop cho chien dich ' + campaign.campaignTitle  +'</p><p>So tien: '+ donation.donationAmount +'</p><p>Code xac nhan: '+ donation.trackingCode +'</p><p>Ban vui long chuyen tien den ' + campaign.Users[0].fullname + ' o dia chi: '+ campaign.Users[0].address + ' - ' + campaign.Users[0].region +'</p>'
        })
    } catch (error) {
        console.log(error);
    }
}

const sendToHostDonateEmail = async (donation, user, campaign) => {
    let method = 'chuyen khoan ngan hang';
    if (donation.donationMethod === 'cash') {
        method = 'chuyen tien mat'
    }
    try {
        await transporter.sendMail({
            to: campaign.Users[0].email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + campaign.campaignTitle,
            html: '<p>Chien dich ' + campaign.campaignTitle + ' vua duoc ' + user.fullname + ' quyen gop voi so tien la ' + donation.donationAmount + ' bang phuong thuc ' + method + '</p><p>Code xac nhan:' + donation.trackingCode + ' </p>'
        })
    } catch (error) {
        console.log(error);
    }
}

const sendToDonorDonateBankingEmail = async (donation, user, campaign, bankAccount) => {
    try {
        await transporter.sendMail({
            to: user.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch' + campaign.campaignTitle,
            html: '<p>Cam on '+ user.fullname +'</p><p>Cam on ban da quyen gop cho chien dich ' + campaign.campaignTitle  +'</p><p>So tien: '+ donation.donationAmount +'</p><p>Code xac nhan: '+ donation.trackingCode +'</p><p>Ban vui long chuyen tien den tai khoan: </p><p>Ten chu tai khoan: ' + bankAccount.accountName + '</p><p>So tai khoan: '+ bankAccount.accountNumber + '</p><p>Ten ngan hang : ' + bankAccount.bankName + ' </p>'
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { sendOTPMail, sendResetPasswordMail, sendToDonorDonateCashEmail, sendToHostDonateEmail, sendToDonorDonateBankingEmail }