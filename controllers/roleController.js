const slug = require('slug');
const Role = require('../models').Role;
const User = require('../models').User;
exports.index = async (req, res, next) => {
    try {
        const roles = await Role.findAll();
        res.render('roles/index', {
            pageTitle: 'Admin - Roles',
            path: '/admin/roles',
            roles: roles
        });
    } catch (error) {
        console.log(error);
    }
};

exports.create = (req, res, next) => {
    res.render('roles/create', {
        pageTitle: 'Admin - Create Roles ',
        path: '/admin/roles',
        message:''
    })
};

exports.store = async (req, res, next) => {
    const roleName = req.body.roleName;   
    try {
        let role = await Role.findOne({ where: { roleName: roleName } });
        if (!role) {
            role = await Role.create({
                            roleName: roleName
                        });
            // req.flash('success', 'Role được tạo thành công.');
            res.redirect('/admin/roles');
        } else {
            req.flash('error', 'Role đã tồn tại.');
            res.render('roles/create', {
                pageTitle: 'Admin - Create Roles ',
                path: '/admin/roles',
                message:'error'
            })
        }
    } catch (error) {
        console.log(error);
    }
};

exports.edit = async (req, res, next) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) {
            req.flash('error', 'Role không tồn tại.');
            res.redirect('/admin/roles');
        } else {
            res.render('roles/edit', {
                pageTitle: 'Admin - Edit Roles ',
                path: '/admin/roles',
                role: role
            })

        }
    } catch (error) {
        console.log(error);
    }
};
exports.update = async (req, res, next) => {
    const roleId = req.body.roleId;
    const roleName = req.body.roleName;
    
    try {
        let role = await Role.findOne({ where: { id: roleId } });
        let checked = await Role.findOne({ where: { roleName: roleName}});
        console.log(checked);
        if (role != null) {
            if(checked === null){
                role = await Role.update({
                    roleName: roleName
                        },{
                            where: {
                               id : roleId
                            }
                        });     
            req.flash('success', 'Role được cập nhật thành công.');
            res.redirect('/admin/roles');  
            }else{
                res.redirect('/admin/roles');
            }       
        } else {
            req.flash('error', 'Role existed.');
            res.redirect('/admin/roles');
        } 
    } catch (error) {
        console.log(error);
    }
};
// exports.delete = async (req, res, next) =>{
//     const roleId = req.params.id;
//     try{
//         let role =  await Role.findByPk(roleId);
//         if (role != null) {
//                 role.destroy(); 
//             req.flash('success', 'Role được cập nhật thành công.');
//             res.redirect('/admin/roles');        
//         } else {
//             req.flash('error', 'Role existed.');
//             res.redirect('/admin/roles');
//         } 
//     }catch(err){
//         console.log(err);
//     }
 

// };
exports.delete = async (req, res, next) =>{
    const roleId = req.params.id;
    try{
        let role =  await Role.findOne({
            where: {
                id : roleId
            },
            include:[User]
        });
        let check = role.Users.length;
        if (role != null) {
            if(check == 0){
            role.destroy(); 
            req.flash('success', 'Role được xóa thành công.');
            res.redirect('/admin/roles');  
            }
            else{
                res.redirect('/admin/roles');
            }     
        } else {
            // res.render('categories/index', {
            //     pageTitle: 'Admin - Create Categories ',
            //     path: '/admin/categories',
            //     message : 'error'
            // })
            req.flash('error', 'Role existed.');
            res.redirect('/admin/roles');
        }
    }catch(err){
        console.log(err);
    }
 

};