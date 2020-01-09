require('dotenv').config();
const express = require('express');
const ExpressConfig = require('./config/ExpressConfig');

(async () => {
    const app = express();
    await ExpressConfig.init(app, process.env.EXPRESS_PORT);
    app.use(await ExpressConfig.route(express.Router()));
})();
