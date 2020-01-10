const session = require('express-session');
const LoginController = require('../controller/LoginController');
const BoardController = require('../controller/BoardController');
const fileUpload = require('express-fileupload');

async function init(express, port) {
    const app = express();
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 },
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }));
    app.use('/upload', express.static('upload'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use('/board', (req, res, next) => {
        if (!req.session || !req.session.userId) {
            return res.redirect('/');
        }
        next();
    });

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
    router.post('/login', LoginController.login);
    router.get('/logout', LoginController.logout);

    router.get('/board', BoardController.index);
    router.get('/board/write', BoardController.formPage);
    router.post('/board/write', BoardController.save);
    router.post('/board/update', BoardController.update);

    router.get('/board/view/:id', BoardController.viewPage);

    router.post('/board/delete', BoardController.delete);

    router.get('/board/update/:id', BoardController.formPage);

    return router;
}

exports.init = init;
exports.route = route;
