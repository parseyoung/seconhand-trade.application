require('dotenv').config();
const express = require('express');
const ExpressConfig = require('./config/ExpressConfig');
const SequelizeConfig = require('./config/SequelizeConfig');
const MybatisConfig = require('./config/MybatisConfig');
const User = require('./model/User');
const Board = require('./model/Board');
const UserDao = require('./dao/UserDao');
const BoardDao = require('./dao/BoardDao');

/**
 * express 초기화 설정
 * @return {Promise<void>}
 */
async function initExpress () {
    const app = await ExpressConfig.init(express, process.env.PORT || process.env.EXPRESS_PORT || 3000);
    app.use(await ExpressConfig.route(express.Router()));
}

/**
 * sequelize 및 model 초기화
 * @return {Promise<void>}
 */
async function initSequelizeAndModels () {
    const sequelize = await SequelizeConfig.init(
        process.env.DB_HOST,
        process.env.DB_DATABASE,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD
    );

    await User.init(sequelize);
    // await User.sync(process.env.DB_SYNC_FORCE);

    await Board.init(sequelize);
    // await Board.sync(process.env.DB_SYNC_FORCE);
}

async function initMybatis() {
    const connection = await MybatisConfig.init(
        process.env.DB_HOST,
        process.env.DB_DATABASE,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD
    );
    UserDao.init(connection);
    BoardDao.init(connection);
}

(async () => {
    try {
        await initExpress();
        await initMybatis();
        // await initSequelizeAndModels();
    } catch (e) {
        console.error(e);
    }
})();
