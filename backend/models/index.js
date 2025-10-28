const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
        const modelDef = require(path.join(__dirname, file));
        const model = modelDef(sequelize);
        db[model.name] = model;
    });

// run associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;
