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
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
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
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
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
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
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
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
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
                subject: 'Cập nhật thông tin chiến dịch ' + title,
                html: html
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const sendCloseMail = async (listEmail, host, title, raise, goal, percent) => {
    try {
        const mailForFollower = templateMails.sendCloseMailToFollower(title, raise, goal, percent);
        const mailForHost = templateMails.sendCloseMailToHost(title, raise, goal, percent);
        for (let i = 0; i < listEmail.length; i++) {
            await transporter.sendMail({
                to: listEmail[i],
                from: 'admin@loveus.com',
                subject: 'Cập nhật thông tin chiến dịch  ' + title,
                html: mailForFollower
            })
        }
        await transporter.sendMail({
            to: host.email,
            from: 'admin@loveus.com',
            subject: 'Cập nhật thông tin chiến dịch  ' + title,
            html: mailForHost
        })
    } catch (error) {
        console.log(error);
    }
}

const sendNotiEndDateMail = async (listEmail, days) => {
    try {
        // const html = templateMails.sendUpdatePostMail(title, slug);
        if (days != 0) {
            for (let i = 0; i < listEmail.length; i++) {
                await transporter.sendMail({
                    to: listEmail[i].email,
                    from: 'admin@loveus.com',
                    subject: 'Cập nhật thông tin chiến dịch ' + listEmail[i].campaign.campaignTitle,
                    html: 'Chien dich con' + days + 'ngay la ket thuc'
                })
                if (days === 1) {
                    for (let j = 0; j < listEmail[i].followers.length; j++) {
                        await transporter.sendMail({
                            to: listEmail[i].followers[j],
                            from: 'admin@loveus.com',
                            subject: 'Cập nhật thông tin chiến dịch ' + listEmail[i].campaign.campaignTitle,
                            html: 'Chien dich con 1 ngay la ket thuc'
                        })
                        
                    }
                }
            }
        } else {
            for (let i = 0; i < listEmail.length; i++) {
                await transporter.sendMail({
                    to: listEmail[i].email,
                    from: 'admin@loveus.com',
                    subject: 'Cập nhật thông tin chiến dịch ' + listEmail[i].campaign.campaignTitle,
                    html: 'Chien dich da ket thuc'
                })
                for (let j = 0; j < listEmail[i].followers.length; j++) {
                    await transporter.sendMail({
                        to: listEmail[i].followers[j],
                        from: 'admin@loveus.com',
                        subject: 'Cập nhật thông tin chiến dịch ' + listEmail[i].campaign.campaignTitle,
                        html: 'Chien dich da ket thuc'
                    })
                    
                }
            }
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
    sendCloseMail,
    sendNotiEndDateMail
}