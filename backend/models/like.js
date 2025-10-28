const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Like = sequelize.define('Like', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        post_id: { type: DataTypes.UUID, allowNull: false },
        user_id: { type: DataTypes.UUID, allowNull: false }
    }, { tableName: 'likes', underscored: true });

    Like.associate = (models) => {
        Like.belongsTo(models.CommunityPost, { foreignKey: 'post_id', as: 'post' });
        Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Like;
};
