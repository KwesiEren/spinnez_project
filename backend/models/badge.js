const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Badge = sequelize.define('Badge', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        badge_name: { type: DataTypes.STRING }
    }, { tableName: 'badges', underscored: true });

    Badge.associate = (models) => {
        Badge.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Badge;
};
