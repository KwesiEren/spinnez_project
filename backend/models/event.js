const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Event = sequelize.define('Event', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        location: { type: DataTypes.STRING },
        date: { type: DataTypes.DATE },
        entry_fee: { type: DataTypes.DECIMAL, defaultValue: 0 },
        reward: { type: DataTypes.STRING },
        host_id: { type: DataTypes.UUID }
    }, { tableName: 'events', underscored: true });

    Event.associate = (models) => {
        // optional host relation
    };

    return Event;
};
