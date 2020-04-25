'use strict';
module.exports = (sequelize, DataTypes) => {
    const BankAccount = sequelize.define('BankAccount', {
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
        tableName: 'ods_bank_account'
    });

    BankAccount.associate = function (models) {
        BankAccount.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return BankAccount;
};