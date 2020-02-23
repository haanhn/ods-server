'use strict';
module.exports = (sequelize, DataTypes) => {
    const BankAccountInfo = sequelize.define('BankAccountInfo', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bankAgency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('enable', 'disable'),
            defaultValue: 'enable'
        }
    }, {
        tableName: 'ods_bank_account_info'
    });

    BankAccountInfo.associate = function (models) {
        BankAccountInfo.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return BankAccountInfo;
};