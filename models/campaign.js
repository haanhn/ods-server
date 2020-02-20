'use strict';
module.exports = (sequelize, DataTypes) => {
    const Campaign = sequelize.define('Campaign', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        campaignTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        campaignSlug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        campaignGoal: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        campaignEndDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        campaignRatingPoint: {
            type: DataTypes.DOUBLE,
            defaultValue: '0',
            allowNull: true
        },
        campaignShortDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        campaignDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        campaignStatus: {
            type: DataTypes.ENUM('waiting', 'public'),
            defaultValue: 'waiting'
        }
    }, {
        tableName: 'ods_campaigns'
    });

    Campaign.associate = function(models) {
        Campaign.belongsTo(models.Category, { foreignKey: 'categoryId' });
        Campaign.hasMany(models.Comment, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Post, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Expense, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Donation, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.CampaignReview, { foreignKey: 'campaignId' });
        Campaign.belongsToMany(models.User, { through: 'UserCampaign', foreignKey: 'campaignId' });
    };

    return Campaign;
};