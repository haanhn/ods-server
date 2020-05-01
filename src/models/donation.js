'use strict';
module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define('Donation', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        donationAmount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        donationMethod: {
            type: DataTypes.ENUM('cash', 'paypal', 'vnpay', 'banking', 'outside'),
            defaultValue: 'banking'
        },
        anonymous: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        trackingCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        outsideDonor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        donationMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        donationStatus: {
            type: DataTypes.ENUM('pending', 'reject', 'done', 'returned'),
            defaultValue: 'pending'
        }
    }, {
        tableName: 'ods_donations'
    });

    Donation.associate = function (models) {
        Donation.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Donation.belongsTo(models.Campaign, {
            foreignKey: 'campaignId'
        });
    };

    return Donation;
};