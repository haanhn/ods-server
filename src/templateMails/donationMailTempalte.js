exports.confirmDonateByCash = (mail) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.donor.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>` +
    mail.campaignTitle +
    `.</i></b> </p>
    <p>Số tiền: <b>` +
    mail.donation.amount +
    `vnđ</b></p>
    <p>Phương thức chuyển tiền: <b>Tiền mặt</b></p>
    <p>Mã xác nhận: <b>` +
    mail.donation.trackingCode +
    `</b></p>
    <p>Bạn vui lòng chuyển tiền đến quản lý chiến dịch với thông tin sau:</p>
    <p>   - Tên: <b>` +
    mail.host.name +
    `</b></p>
    <p>   - Địa chỉ: <b>` +
    mail.host.address +
    `</b></p>
    <p>   - Thành phố : <b>` +
    mail.host.region +
    `</b></p>`);
};

exports.confirmDonateByBanking = (mail) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.donor.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>` +
    mail.campaignTitle +
    `.</i></b> </p>
    <p>Số tiền: <b>` +
    mail.donation.amount +
    ` vnđ</b></p>
    <p>Phương thức chuyển tiền: <b>Chuyển khoản ngân hàng</b></p>
    <p>Mã xác nhận: <b>` +
    mail.donation.trackingCode +
    `</b></p>
    <p>Bạn vui lòng chuyển tiền đến quản lý chiến dịch với thông tin sau:</p>
    <p>   - Tên chủ tài khoản : <b>` +
    mail.host.accountName +
    `</b></p>
    <p>   - Số tài khoản: <b>` +
    mail.host.accountNumber +
    `</b></p>
    <p>   - Tên ngân hàng : <b>` +
    mail.host.bankName +
    `</b></p>`);
};

exports.confirmDonateByOnlinePayment = (mail) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.donor.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>` +
    mail.campaignTitle +
    `.</i></b> </p>
    <p>Số tiền: <b>` +
    mail.donation.amount +
    ` vnđ</b></p>
    <p>Phương thức chuyển tiền: <b>Thanh toán` +
    mail.donation.method +
    `</b></p>
    <p>Mã xác nhận: <b>` +
    mail.donation.trackingCode +
    `</b></p>`);
};

exports.confirmDonateForHost = (mail, method) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.host.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style="color: #3cc88f;">LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch: <b><i style="text-transform: uppercase;">` +
    mail.campaignTitle +
    `</i></b> vừa nhận được quyên góp với thông tin như sau:</p>
    <p>   - Tên: <b>` +
    mail.donor.name +
    `</b></p>
    <p>   - Email: <b>` +
    mail.donor.email +
    `</b></p>
    <p>   - Số tiền : <b>` +
    mail.donation.amount +
    ` vnđ</b></p>
    <p>   - Phương thức chuyển tiền: <b>` +
    method +
    `</b></p>
    <p>   - Mã xác nhận : <b>` +
    mail.donation.trackingCode +
    `</b></p>
    <p>
        <i>Khi nhận được tiền mong bạn vui lòng cập nhật trạng thái trên hệ thống hoặc click vào đây <form action="http://127.0.0.1:5000/api/donations/host/update-donation-status-via-email/approve" method="post">
                <input type="hidden" name="donationId" value="` +
    mail.donation.id +
    `">
                <input type="hidden" name="userId" value="` +
    mail.host.id +
    `">
                <button type="submit" style="color: white; background-color:#3cc88f;border-radius: 30px; padding: 15px 45px;cursor: pointer;outline: none;">Xác nhận</button>
            </form>
            để xác nhận đã nhận tiền.
        </i>
    </p>`);
};

exports.confirmDonatePaypalForHost = (mail, method) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.host.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style="color: #3cc88f;">LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch: <b><i style="text-transform: uppercase;">` +
    mail.campaignTitle +
    `</i></b> vừa nhận được quyên góp với thông tin như sau:</p>
    <p>   - Tên: <b>` +
    mail.donor.name +
    `</b></p>
    <p>   - Email: <b>` +
    mail.donor.email +
    `</b></p>
    <p>   - Số tiền : <b>` +
    mail.donation.amount +
    ` vnđ</b></p>
    <p>   - Phương thức chuyển tiền: <b>` +
    method +
    `</b></p>
    <p>   - Mã xác nhận : <b>` +
    mail.donation.trackingCode +
    `</b></p>
    <p><i>Hãy liên hệ với ban quản lý website để yêu cầu nhận số tiền trên.</i></p>`);
};

exports.updateStatusDonation = (mail) => {
  return (html =
    `<p><b><i>Kính gửi: ` +
    mail.donor.name +
    `</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>cảm ơn bạn đã quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>` +
    mail.campaignTitle +
    `.</i></b> </p>
    <p>Số tiền quyên góp: <b>` +
    mail.donation.amount +
    `vnđ</b></p>
    <p>Mã xác nhận: <b>` +
    mail.donation.trackingCode +
    `</b></p>
    <p>` +
    mail.status +
    `</p>`);
};

exports.updatePost = (title, slug) => {
  return (html =
    `<p><b><i>Xin chào</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch bạn đang theo dõi: <b><i style='text-transform: uppercase;'>` +
    title +
    `.</i></b> đã được cập nhật thông tin.</p>
    Vui lòng click vào <a href='http://127.0.0.1:5000/api/posts/get-all-post/` +
    slug +
    `' target='_blank'><u>đây</u> để xem chi tiết</a>`);
};

exports.sendCloseMailToFollower = (title, raise, goal, percent) => {
  return (html =
    `<p><b><i>Xin chào</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch bạn đang theo dõi: <b><i style='text-transform: uppercase;'>` +
    title +
    `.</i></b> đã kết thúc.</p>
    <p>Chiến dịch đã quyên góp được số tiền là ` +
    raise +
    `/` +
    goal +
    ` (` +
    percent +
    `%)</p>
    <p>Cảm ơn bạn đã theo dõi và ủng hộ chiến dịch. Mọi đóng góp và hỗ trợ của bạn đã góp phần cho sự thành công của chiến dịch này</p>`);
};

exports.sendCloseMailToHost = (title, raise, goal, percent) => {
  return (html =
    `<p><b><i>Xin chào</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Chiến dịch của bạn: <b><i style='text-transform: uppercase;'>` +
    title +
    `.</i></b> đã kết thúc.</p>
    <p>Chiến dịch đã quyên góp được số tiền là ` +
    raise +
    `/` +
    goal +
    ` (` +
    percent +
    `%)</p>
    <p>Bạn vui lòng tiếp tục cập nhật thông tin về chiến dịch và chi phí thực hiện chiến dịch</p>
    <p>Xin cảm ơn.</p>`);
};

exports.notiDonation = (donation, campaign, method) => {
  return (html =
    `<p><b><i>Xin chào</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Quyên góp cho chiến dịch của bạn: <b><i style='text-transform: uppercase;'>` +
    campaign.campaignTitle +
    `.</i></b> đã 7 ngày chưa được xác nhận.</p>
    <p>Bạn vui lòng xác nhận cho quyên góp với thông tin sau:</p>
    <p>   - Số tiền : <b>` +
    donation.donationAmount +
    ` vnđ</b></p>
    <p>   - Phương thức chuyển tiền: <b>` +
    method +
    `</b></p>
    <p>   - Mã xác nhận : <b>` +
    donation.trackingCode +
    `</b></p>
    <p>Xin cảm ơn.</p>`);
};

exports.rejectDonation = (donor, donation, campaign, method) => {
  return (html =
    `<p><b><i>Xin chào</i></b></p>
    <p>Lời đầu tiên <b style='color: #3cc88f;'>LoveUs</b> xin cảm ơn đã tin dùng dịch vụ của chúng tôi.</p>
    <p>Quyên góp cho chiến dịch: <b><i style='text-transform: uppercase;'>` +
    campaign.campaignTitle +
    `</i></b> đã bị hủy bỏ vì 10 ngày chưa được xác nhận.</p>
    <p>Thông tin chi tiết về quyên góp:</p>
    <p>   - Số tiền : <b>` +
    donation.donationAmount +
    ` vnđ</b></p>
    <p>   - Phương thức chuyển tiền: <b>` +
    method +
    `</b></p>
    <p>   - Mã xác nhận : <b>` +
    donation.trackingCode +
    `</b></p>
    <p>Nếu có bất kỳ ý kiến thắc mắc xin vui lòng liên hệ ban quản trị ODS Platform</p>
    <p>Xin cảm ơn.</p>`);
}