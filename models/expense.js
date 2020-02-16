'use strict';
module.exports = (sequelize, DataTypes) => {
    const Expense = sequelize.define('Expense', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        tableName: 'expenses'
    });

    Expense.associate = function(models) {
        Expense.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
        Expense.hasMany(models.ExpenseDetail, { foreignKey: 'expenseId' });
    };

    return Expense;
};