const bcrypt = require('bcryptjs');
const dotenv=require('dotenv');

const Models = require('./models');

exports.createAdmin = async () => {
    const adminRole = await Models.Role.findOne({
        where: {
            roleName: 'admin'
        }
    })
    const checkAdmin = await Models.User.findOne({
        where: {
            email: 'admin@loveus.com'
        }
    });
    if (!checkAdmin){
        const adminPassword = process.env.ADMIN_PASSWORD;
        const hash = bcrypt.hashSync(adminPassword, 10);
        await Models.User.create({
            email: 'admin@loveus.com',
            fullname: 'Admin LoveUs',
            password: hash,
            roleId: adminRole.id
        })    
    }
    
}