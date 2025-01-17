'use strict';
module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define('OTP', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        otpToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expirate: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'ods_otps'
    });
    
    return OTP;
};