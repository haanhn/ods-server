const bcrypt = require('bcryptjs');
const session = require('express-session');

const Models = require('../../models');

exports.login = async (req, res, next) => {
    try {
        if (req.session.loggedin) {
            res.redirect('/admin');
        }
        res.render('login', {
            pageTitle: 'Admin - Login',
            path: '/admin/login',
        });
    } catch (error) {
        console.log(error);
    }
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const memberRole = await Models.Role.findOne({
        where: {
            roleName: 'admin'
        }
    });
    if (email && password) {
        const user = await Models.User.findOne({
            where: {
                email: email,
                roleId: memberRole.id
            }
        });
        console.log(user);
        if (user) {
            const comparePassword = await bcrypt.compare(req.body.password, user.password);
            if (comparePassword) {
                req.session.loggedin = true;
                req.session.user = user;
                res.redirect('/admin');
            } else {
                req.flash('error', 'Incorrect password.');
                res.redirect('/admin/login');
            }
        } else {
            req.flash('error', 'Incorrect email');
            res.redirect('/admin/login');
        }
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
}

exports.logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/admin/login');
}