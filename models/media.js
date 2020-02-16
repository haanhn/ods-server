'use strict';
module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('Media', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'medias'
    });

    Media.associate = function(models) {
        Media.belongsTo(models.Post, { foreignKey: 'postId' });
    };

    return Media;
};