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
            allowNull: true
        },
        campaignStartDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        campaignEndDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        campaignThumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        campaignRatingPoint: {
            type: DataTypes.DOUBLE,
            defaultValue: '0'
        },
        rankingPoint: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        campaignShortDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        campaignDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        campaignAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // campaignRegion: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        campaignStatus: {
            type: DataTypes.ENUM('setting', 'waiting', 'public', 'block', 'close'),
            defaultValue: 'setting'
        },
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        autoClose: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'ods_campaigns'
    });


    Campaign.associate = function(models) {
        Campaign.belongsTo(models.Category, { foreignKey: 'categoryId' });
        Campaign.belongsTo(models.Region, { foreignKey: 'regionId' });
        Campaign.hasMany(models.Comment, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Post, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Expense, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.Donation, { foreignKey: 'campaignId' });
        Campaign.hasMany(models.CampaignReview, { foreignKey: 'campaignId' });
        Campaign.belongsToMany(models.User, { through: 'UserCampaign', foreignKey: 'campaignId' });
    };

    return Campaign;
};