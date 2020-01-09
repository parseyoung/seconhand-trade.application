const IndexController = require('../controller/IndexController');

async function init(app, port) {
    app.engine('html', require('ejs').renderFile);
    app.set('views', './views');
    app.set('view engine', 'html');
    await app.listen(port);
    console.log(`express listen to ${port} port`);
}

async function route(router) {
    router.get('/', IndexController.index);

    return router;
}

exports.init = init;
exports.route = route;
