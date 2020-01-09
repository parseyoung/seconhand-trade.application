const LoginController = require('../controller/LoginController');

async function init(express, port) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded());

    app.engine('html', require('ejs').renderFile);
    app.set('views', './views');
    app.set('view engine', 'html');

    await app.listen(port);
    console.log(`express listen to ${port} port`);

    return app;
}

async function route(router) {
    router.get('/', LoginController.index);
    router.get('/join', LoginController.joinView);
    router.post('/join', LoginController.join);

    return router;
}

exports.init = init;
exports.route = route;
