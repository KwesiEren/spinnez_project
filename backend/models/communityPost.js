const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CommunityPost = sequelize.define('CommunityPost', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        content: { type: DataTypes.TEXT },
        media_url: { type: DataTypes.TEXT }
    }, { tableName: 'community_posts', underscored: true });

    CommunityPost.associate = (models) => {
        CommunityPost.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        CommunityPost.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments' });
        CommunityPost.hasMany(models.Like, { foreignKey: 'post_id', as: 'likes' });
    };

    return CommunityPost;
};
