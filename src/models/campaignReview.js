'use strict';
module.exports = (sequelize, DataTypes) => {
    const CampaignReview = sequelize.define('CampaignReview', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        point: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'ods_campaign_reviews'
    });

    CampaignReview.associate = function(models) {
        CampaignReview.belongsTo(models.User, { foreignKey: 'userId' });
        CampaignReview.belongsTo(models.Campaign, { foreignKey: 'campaignId' });

    };

    return CampaignReview;
};