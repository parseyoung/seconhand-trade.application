const session = require('express-session');
const LoginController = require('../controller/LoginController');
const BoardController = require('../controller/BoardController');
const fileUpload = require('express-fileupload');

/**
 * express 초기화
 * @param express express 객체
 * @param port express가 사용할 포트 번호
 * @return {Promise<*>}
 */
async function init(express, port) {
    const app = express();
    // express에서 사용할 session 설정
    app.use(session({
        // session cookie 암호화시 사용할 암호화 키값
        secret: process.env.SESSION_SECRET,
        // 재저장을 계속 할 것인지의 옵션이다. 세션에 요청이 들어간 후에 세션에 변동이 있든 없든 무조건 저장하겠다는 옵션
        resave: true,
        // 세션이 세션 store에 저장되기 전에 uninitialized 된 상태로 만들어서 저장한다.
        saveUninitialized: true
    }));

    // express에서 fileupload 설정 부분
    app.use(fileUpload({
        // 최대 업로드 파일사이즈 설정
        limits: { fileSize: 10 * 1024 * 1024 },
        // temp 파일 사용 여부 (사용 안할시 메모리 사용하게됨)
        useTempFiles : true,
        // temp파일 저장 위치
        tempFileDir : '/tmp/'
    }));
    // 정적 파일 경로 및 url설정
    app.use('/upload', express.static('upload'));
    // request body에 json형태로 들어오는 것을 req.body에 대입해준다.
    app.use(express.json());
    // request body에 url encoding 형태로 들어오는 것을 req.body에 대입해준다.
    app.use(express.urlencoded());
    // /board로 진입하는 모든 요청이 거쳐감 (middleware:  요청에 대한 응답 과정 중간에 껴서 어떠한 동작)
    app.use('/board', (req, res, next) => {
        // 로그인 안되있으면 로그인 페이지로 이동
        if (!req.session || !req.session.userId) {
            return res.redirect('/');
        }
        next();
    });

    // view template engine으로 ejs사용
    app.engine('html', require('ejs').renderFile);
    app.set('views', './views');
    app.set('view engine', 'html');

    await app.listen(port);
    console.log(`express listen to ${port} port`);

    return app;
}

/**
 * express가 처리한 url 경로 및 해당 경로로 요청 들어올시 처리할 함수 정의
 * @param router express Router객체
 * @return {Promise<*>}
 */
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
