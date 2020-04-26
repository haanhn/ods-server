'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        categoryTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categorySlug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // categoryIcon: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        status: {
            type: DataTypes.ENUM('enable', 'disable'),
            defaultValue: 'enable'
        }
    }, {
        tableName: 'ods_categories'
    });

    Category.associate = function(models) {
        Category.hasMany(models.Campaign, { foreignKey: 'categoryId' });
    };

    return Category;
};