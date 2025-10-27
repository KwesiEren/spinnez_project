const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        logging: false
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false
        }
    );

module.exports = sequelize;
