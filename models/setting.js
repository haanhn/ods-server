'use strict';
module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        settingKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        settingValue: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'ods_settings'
    });

    return Setting;
};