require('dotenv').config();
const express = require('express');
const ExpressConfig = require('./config/ExpressConfig');
const SequelizeConfig = require('./config/SequelizeConfig');
const User = require('./model/User');

async function initExpress () {
    const app = await ExpressConfig.init(express, process.env.EXPRESS_PORT);
    app.use(await ExpressConfig.route(express.Router()));
}

async function initSequelizeAndModels () {
    const sequelize = await SequelizeConfig.init(
        process.env.DB_HOST,
        process.env.DB_DATABASE,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD
    );

    await User.init(sequelize);
    await User.sync(process.env.DB_SYNC_FORCE);
}

(async () => {
    try {
        await initExpress();
        await initSequelizeAndModels();
    } catch (e) {
        console.error(e);
    }
})();
