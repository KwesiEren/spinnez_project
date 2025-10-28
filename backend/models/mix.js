const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Mix = sequelize.define('Mix', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        file_url: { type: DataTypes.TEXT, allowNull: false },
        title: { type: DataTypes.STRING },
        genre: { type: DataTypes.STRING },
        bpm: { type: DataTypes.INTEGER },
        mood: { type: DataTypes.STRING },
        plays: { type: DataTypes.BIGINT, defaultValue: 0 },
        likes_count: { type: DataTypes.BIGINT, defaultValue: 0 }
    }, { tableName: 'mixes', underscored: true });

    Mix.associate = (models) => {
        Mix.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Mix;
};
