'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserCampaign = sequelize.define('UserCampaign', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        relation: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'user_campaigns'
    });

    return UserCampaign;
};