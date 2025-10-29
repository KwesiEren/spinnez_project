const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending', // pending | success | failed
        },
        payment_method: {
            type: DataTypes.STRING,
            defaultValue: 'Paystack',
        },
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    };

    return Transaction;
};
