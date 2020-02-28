'use strict';
module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define('Region', {
        matp: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
        tableName: 'ods_regions'
    });

    return Region;
};