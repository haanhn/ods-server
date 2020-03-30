const Role = require('../../models').Role;

exports.index = async (req, res, next) => {
    try {
        const roles = await Role.findAll();
        res.render('roles/index', {
        pageTitle: 'Admin - Roles',
        path: '/admin/roles',
        admin: req.user,
        roles: roles
        });
    } catch (error) {
        console.log(error);
    }
};

exports.create = (req, res, next) => {
    res.render('roles/create', {
        pageTitle: 'Admin - Create Roles ',
        admin: req.user,
        path: '/admin/roles'
    });
};

exports.store = async (req, res, next) => {
    const roleName = req.body.roleName;

    try {
        let role = await Role.findOne({
            where: { roleName: roleName }
        });
        if (!role) {
            role = await Role.create({
                roleName: roleName
            });
            req.flash('success', 'Role được tạo thành công.');
            res.redirect('/admin/roles');
        } else {
            req.flash('error', 'Role đã tồn tại.');
            res.redirect('/admin/roles');
        }
    } catch (error) {
        console.log(error);
    }
};

exports.edit = async (req, res, next) => {
  const roleId = req.params.roleId;
  try {
    const role = await Role.findOne({ where: { id: roleId } });
    if (!role) {
      req.flash('error', 'Role không tồn tại.');
      res.redirect('/admin/roles');
    } else {
      res.render('roles/edit', {
        pageTitle: 'Admin - Edit Role ',
        path: '/admin/roles',
        admin: req.user,
        role: role
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res, next) => {
  const roleId = req.body.roleId;
  const roleName = req.body.roleName;
  const role = await Role.findOne({
    where: {
      id: roleId
    }
  });
  if (!role) {
    req.flash('error', 'Role không tồn tại.');
    res.redirect('/admin/roles/edit/' + roleId);
  } else {
    role.roleName = roleName;
    await role.save();
    req.flash('success', 'Role update thành công.');
    res.redirect('/admin/roles');
  }
};

exports.delete = async (req, res, next) => {
  const roleId = req.params.roleId;
  const role = await Role.findOne({
    where: {
      id: roleId
    }
  });

  if(!role) {
    req.flash('error', 'Role không tồn tại.');
    res.redirect('/admin/roles');
  } else {
    await role.destroy();
    req.flash('success', 'Role được xóa thành công.');
    res.redirect('/admin/roles');
  }
};