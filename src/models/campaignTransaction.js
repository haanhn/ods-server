'use strict';
module.exports = (sequelize, DataTypes) => {
    const CampaignTransaction = sequelize.define('CampaignTransaction', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        transactionType: {
            type: DataTypes.ENUM('receive', 'withdraw'),
            allowNull: false
        }
    }, {
        tableName: 'ods_campaign_transaction'
    });

    CampaignTransaction.associate = function(models) {
        CampaignTransaction.belongsTo(models.User, { foreignKey: 'userId' });
        CampaignTransaction.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
        CampaignTransaction.belongsTo(models.Donation, { foreignKey: 'donationId' });
    };

    return CampaignTransaction;
};