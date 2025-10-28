const sequelize = require('../config/database');
const db = require('../models');

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('DB synced');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
