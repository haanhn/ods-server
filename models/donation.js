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
            type: DataTypes.ENUM('cash', 'paypal', 'stripe', 'transfer'),
            defaultValue: 'transfer'
        },
        donationStatus: {
            type: DataTypes.ENUM('pending', 'reject' ,'done'),
            defaultValue: 'pending'
        }
    }, {
        tableName: 'ods_donations'
    });

    Donation.associate = function(models) {
        Donation.belongsTo(models.User, { foreignKey: 'userId' });
        Donation.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    };

    return Donation;
};