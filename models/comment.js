'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {});

    Comment.associate = function(models) {
        Comment.belongsTo(models.User, { foreignKey: 'userId' });
        Comment.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    };

    return Comment;
};