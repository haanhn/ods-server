exports.sendToDonorDonateCashEmail = (mail) => {
    return html = `<p><b><i>Kính gửi: ` + mail.donor.name + `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>`+ mail.campaignTitle +`.</i></b> </p>
    <p>Số tiền: <b>`+ mail.donation.amount + `vnđ</b></p>
    <p>Phương thức chuyển tiền: <b>Tiền mặt</b></p>
    <p>Mã xác nhận: <b>`+ mail.donation.trackingCode +`</b></p>
    <p>Bạn vui lòng chuyển tiền đến quản lý chiến dịch với thông tin sau:</p>
    <p>   - Tên: <b>`+ mail.host.name +`</b></p>
    <p>   - Địa chỉ: <b>`+ mail.host.address +`</b></p>
    <p>   - Thành phố : <b>`+ mail.host.region +`</b></p>`
}

exports.sendToDonorDonateBankingEmail = (mail) => {
    return html = `<p><b><i>Kính gửi: ` + mail.donor.name + `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>`+ mail.campaignTitle +`.</i></b> </p>
    <p>Số tiền: <b>`+ mail.donation.amount + ` vnđ</b></p>
    <p>Phương thức chuyển tiền: <b>Chuyển khoản ngân hàng</b></p>
    <p>Mã xác nhận: <b>`+ mail.donation.trackingCode +`</b></p>
    <p>Bạn vui lòng chuyển tiền đến quản lý chiến dịch với thông tin sau:</p>
    <p>   - Tên chủ tài khoản : <b>`+ mail.host.accountName +`</b></p>
    <p>   - Số tài khoản: <b>`+ mail.host.accountNumber +`</b></p>
    <p>   - Tên ngân hàng : <b>`+ mail.host.bankName +`</b></p>`
}

exports.sendToHostDonateEmail = (mail, method) => {
    return html = `<p><b><i>Kính gửi: `+ mail.host.name +`</i></b></p>
    <p>Lời đầu tiên <b style="color: #3cc88f;">LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch: <b><i style="text-transform: uppercase;">`+ mail.campaignTitle + `</i></b> vừa nhận được quyên góp với thông tin như sau:</p>
    <p>   - Tên: <b>`+ mail.donor.name +`</b></p>
    <p>   - Email: <b>`+ mail.donor.email +`</b></p>
    <p>   - Số tiền : <b>`+ mail.donation.amount +` vnđ</b></p>
    <p>   - Phương thức chuyển tiền: <b>`+ method +`</b></p>
    <p>   - Mã xác nhận : <b>`+ mail.donation.trackingCode +`</b></p>
    <p>
        <i>Khi nhận được tiền mong bạn vui lòng cập nhật trạng thái trên hệ thống hoặc click vào đây <form action="http://localhost:5000/api/donations/host/update-donation-status-via-email/approve" method="post">
                <input type="hidden" name="donationId" value="`+ mail.donation.id +`">
                <input type="hidden" name="userId" value="`+ mail.host.id +`">
                <button type="submit" style="color: white; background-color:#3cc88f;border-radius: 30px; padding: 15px 45px;cursor: pointer;outline: none;">Xác nhận</button>
            </form>
            để xác nhận đã nhận tiền.
        </i>
    </p>`
}