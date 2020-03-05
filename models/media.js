'use strict';
module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('Media', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'ods_media'
    });

    Media.associate = function(models) {
        Media.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    };

    return Media;
};