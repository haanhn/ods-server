'use strict';
module.exports = (sequelize, DataTypes) => {
    const HostReview = sequelize.define('HostReview', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        point: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'ods_host_reviews'
    });

    HostReview.associate = function(models) {
        HostReview.belongsTo(models.User, { foreignKey: 'reviewerId' });
        HostReview.belongsTo(models.User, { foreignKey: 'hostId' });
    };

    return HostReview;
};