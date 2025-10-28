const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        post_id: { type: DataTypes.UUID, allowNull: false },
        user_id: { type: DataTypes.UUID, allowNull: false },
        comment_text: { type: DataTypes.TEXT }
    }, { tableName: 'comments', underscored: true });

    Comment.associate = (models) => {
        Comment.belongsTo(models.CommunityPost, { foreignKey: 'post_id', as: 'post' });
        Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Comment;
};
