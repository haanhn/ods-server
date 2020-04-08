const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const templateMails = require('../templateMails/donationMailTempalte');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))


const sendOTP = async (otp) => {
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

// const resetToken = async (user) => {
//     try {
//         await transporter.sendMail({
//             to: user.email,
//             from: 'admin@loveus.com',
//             subject: 'Reset password OTP Token',
//             html: '<p>Here is your OTP token to reset password: <b>' + user.resetToken + '</b></p>'
//         }) 
//     } catch (error) {
//         console.log(error);
//     }
// }

const confirmDonate = async (mail) => {
    try {
        console.log(mail);
        let method = 'Chuyển khoản ngân hàng';
        let mailForHost = templateMails.confirmDonateForHost(mail, method);
        let mailForDonator = '';
        if (mail.donation.method === 'cash') {
            method = 'Chuyển tiền mặt'
            mailForDonator = templateMails.confirmDonateByCash(mail);
        } else if (mail.donation.method === 'banking') {
            mailForDonator = templateMails.confirmDonateByBanking(mail);
        } else if (mail.donation.method === 'paypal') {
            method = 'Thanh toán Paypal'
            mailForDonator = templateMails.confirmDonateByOnlinePayment(mail);
            mailForHost = templateMails.confirmDonatePaypalForHost(mail, method);
        } else {
            method = 'Thanh toán VNPay'
            mailForDonator = templateMails.confirmDonateByPaypal(mail);
            mailForHost = templateMails.confirmDonatePaypalForHost(mail, method);
        }
        await transporter.sendMail({
            to: mail.donor.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
            html: mailForDonator
        });
        await transporter.sendMail({
            to: mail.host.email,
            from: 'admin@loveus.com',
            subject: 'Xác nhận quyên góp chiến dịch ' + mail.campaignTitle,
            html: mailForHost
        })
    } catch (error) {
        console.log(error);
    }
}


const updateStatusDonation = async (mail) => {
    try {
        const html = templateMails.updateStatusDonation(mail);
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

const updatePost = async (listEmail, title, slug) => {
    try {
        console.log('aaaaaaaaaaaaaaa');
        const html = templateMails.updatePost(title, slug);
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

const notiEndDate = async (email) => {
    try {
        console.log(email);
        // const html = templateMails.sendUpdatePostMail(title, slug);
        if (email.countDays != 0) {
            await transporter.sendMail({
                to: email.host,
                from: 'admin@loveus.com',
                subject: 'Cập nhật thông tin chiến dịch ' + email.campaign.campaignTitle,
                html: 'Chien dich con ' + email.countDays + ' ngay la ket thuc'
            })
            if (email.countDays === 1) {
                for (let j = 0; j < email.followers.length; j++) {
                    await transporter.sendMail({
                        to: email.followers[j],
                        from: 'admin@loveus.com',
                        subject: 'Cập nhật thông tin chiến dịch ' + email.campaign.campaignTitle,
                        html: 'Chien dich con 1 ngay la ket thuc'
                    })
                    
                }
            }
        } else {
            await transporter.sendMail({
                to: email.host,
                from: 'admin@loveus.com',
                subject: 'Cập nhật thông tin chiến dịch ' + email.campaign.campaignTitle,
                html: 'Chien dich da ket thuc'
            })
            for (let j = 0; j < email.followers.length; j++) {
                await transporter.sendMail({
                    to: email.followers[j],
                    from: 'admin@loveus.com',
                    subject: 'Cập nhật thông tin chiến dịch ' + email.campaign.campaignTitle,
                    html: 'Chien dich da ket thuc'
                })
                
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const notiDonation = async (host, donation, campaign) => {
    try {
        let method = '';
        switch (donation.donationMethod) {
            case 'cash':
                method = 'Chuyển tiền mặt';
                break;
            case 'banking':
                method = 'Chuyển tiền ngân hàng';
                break;
            default:
                break;
        }
        const html = templateMails.notiDonation(donation, campaign, method);
        await transporter.sendMail({
            to: host,
            from: 'admin@loveus.com',
            subject: 'Nhắc nhở xác nhận quyên góp ' + donation.trackingCode,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { 
    sendOTP, 
    // resetToken, 
    confirmDonate, 
    updateStatusDonation,
    updatePost, 
    sendCloseMail,
    notiEndDate,
    notiDonation
}