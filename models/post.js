'use strict';
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        postTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postContent: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        postStatus: {
            type: DataTypes.ENUM('enable', 'disable'),
            defaultValue: 'enable'
        }
    }, {
        tableName: 'posts'
    });

    Post.associate = function(models) {
        Post.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
        Post.hasMany(models.Media, { foreignKey: 'postId' });
    };

    return Post;
};