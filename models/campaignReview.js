'use strict';
module.exports = (sequelize, DataTypes) => {
    const CampaignReview = sequelize.define('CampaignReview', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'campaign_reviews'
    });

    CampaignReview.associate = function(models) {
        CampaignReview.belongsTo(models.User, { foreignKey: 'userId' });
        CampaignReview.belongsTo(models.Campaign, { foreignKey: 'campaignId' });

    };

    return CampaignReview;
};