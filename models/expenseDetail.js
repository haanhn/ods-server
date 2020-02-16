'use strict';
module.exports = (sequelize, DataTypes) => {
    const ExpenseDetail = sequelize.define('ExpenseDetail', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        expenseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expenseCost: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expenseDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'expense_details'
    });

    ExpenseDetail.associate = function(models) {
        ExpenseDetail.belongsTo(models.Expense, { foreignKey: 'expenseId' });
    };

    return ExpenseDetail;
};