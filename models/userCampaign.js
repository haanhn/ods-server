'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserCampaign = sequelize.define('UserCampaign', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        relation: {
            type: DataTypes.ENUM('host', 'follower'),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'ods_user_campaigns'
    });

    return UserCampaign;
};