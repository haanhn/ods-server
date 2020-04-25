'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserCampaignMatch = sequelize.define('UserCampaignMatch', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        matchPoint: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        }
    }, {
        tableName: 'ods_user_campaign_match'
    });

    UserCampaignMatch.associate = function(models) {
        UserCampaignMatch.belongsTo(models.User, { foreignKey: 'userId' });
        UserCampaignMatch.belongsTo(models.Campaign, { foreignKey: 'campaignId' });

    };

    return UserCampaignMatch;
};