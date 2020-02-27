'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gender: {
            type: DataTypes.BOOLEAN,
            defaultValue: '1',
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetToken: {
            type: DataTypes.STRING
        },
        resetTokenExpiration: {
            type: DataTypes.DATE
        }
        ,
        rememberToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('not verified', 'verified'),
            defaultValue: 'not verified'
        }
    }, {
        tableName: 'ods_users'
    });

    User.associate = function(models) {
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.belongsTo(models.Region, { foreignKey: 'regionId' });
        User.hasMany(models.Comment, { foreignKey: 'userId' });
        User.hasMany(models.Donation, { foreignKey: 'userId' });
        User.hasMany(models.CampaignReview, { foreignKey: 'userId' });
        User.belongsToMany(models.Campaign, { through: 'UserCampaign', foreignKey: 'userId' });
    };

    return User;
};