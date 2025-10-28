const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MentorshipRequest = sequelize.define('MentorshipRequest', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        mentee_id: { type: DataTypes.UUID, allowNull: false },
        mentor_id: { type: DataTypes.UUID },
        status: { type: DataTypes.ENUM('pending', 'active', 'completed', 'rejected'), defaultValue: 'pending' },
        started_at: { type: DataTypes.DATE },
        completed_at: { type: DataTypes.DATE }
    }, { tableName: 'mentorship_requests', underscored: true });

    MentorshipRequest.associate = (models) => {
        MentorshipRequest.belongsTo(models.User, { foreignKey: 'mentee_id', as: 'mentee' });
        MentorshipRequest.belongsTo(models.User, { foreignKey: 'mentor_id', as: 'mentor' });
    };

    return MentorshipRequest;
};
