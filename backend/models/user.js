const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('upcoming', 'seasoned'), allowNull: false },
        name: { type: DataTypes.STRING },
        dj_name: { type: DataTypes.STRING },
        bio: { type: DataTypes.TEXT },
        genre: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        photo: { type: DataTypes.STRING },
        socials: { type: DataTypes.JSONB },
        is_premium: { type: DataTypes.BOOLEAN, defaultValue: false },
        rating: { type: DataTypes.FLOAT, defaultValue: 0 }
    }, {
        tableName: 'users',
        underscored: true
    });

    User.associate = (models) => {
        User.hasMany(models.Mix, { foreignKey: 'user_id', as: 'mixes' });
        User.hasMany(models.MentorshipRequest, { foreignKey: 'mentee_id', as: 'menteeRequests' });
        User.hasMany(models.MentorshipRequest, { foreignKey: 'mentor_id', as: 'mentorRequests' });
        User.hasMany(models.CommunityPost, { foreignKey: 'user_id', as: 'posts' });
        User.hasMany(models.Badge, { foreignKey: 'user_id', as: 'badges' });
    };

    return User;
};
