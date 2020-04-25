const isAdmin = async (req, res, next) => {
    if (req.session.loggedin) {
        req.user = req.session.user;
        next();
    } else {
        return res.redirect('/admin/login');
    }
}

module.exports = {isAdmin : isAdmin};