'use strict';
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
        tableName: 'ods_roles'
    });

    Role.associate = function(models) {
        Role.hasMany(models.User, { foreignKey: 'roleId' });
    };

    return Role;
};