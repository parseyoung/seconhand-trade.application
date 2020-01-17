const UserService = require('../service/UserService');

/**
 * 로그인 페이지를 출력한다.
 * @param req
 * @param res
 */
exports.index = (req, res) => {
    res.render('index.html', { });
};

/**
 * 회원 가입 페이지를 출력한다.
 * @param req
 * @param res
 */
exports.joinView = (req, res) => {
    res.render('join.html', { });
};

/**
 * 회원가입 확인 클릭시 회원 가입 절차를 수행한다.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.join = async (req, res) => {
    const { userId, username, password } = req.body;
    // userId, username, password는 필수값이므로 없으면 에러를 보낸다.
    if (!userId || !username || !password) {
        res.status(400).send('정상적이 요청이 아닙니다.');
        return;
    }

    // 아이디 중복이 있을 수 있으므로 검사하여 있으면 에러를 발생시킨다.
    const user = await UserService.findByUserId(userId);
    if (user) {
        res.status(400).send('아이디가 중복됩니다.');
        return;
    }

    // 아이디 중복이 아닌경우 해당 유저 정보를 DB에 저장한다.
    const result = await UserService.createNewOne(userId, password, username);
    res.sendStatus(result ? 200 : 500);
};

/**
 * 회원 로그인 클릭시 회원인지 판단하여 세션에 회원 정보를 저장한다.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.login = async (req, res) => {
    const { userId, password } = req.body;

    // userId, password는 필수값이므로 없으면 에러를 발생시킨다.
    if (!userId || !password) {
        res.status(400).send('정상적이 요청이 아닙니다.');
        return;
    }

    // 유저 아이디를 기준으로 DB에서 회원정보를 가져온다.
    const user = await UserService.findByUserId(userId);
    // 회원 정보가 없거나 비번이 맞지 않으면 에러를 발생시킨다.
    if (!user || user.password !== password) {
        res.status(400).send('회원정보가 존재하지 않습니다.');
        return;
    }

    // 회원 정보가 일치할 경우 세션에 해당 회원의 정보를 저장한다.
    req.session.userId = user.userId;
    req.session.username = user.username;

    res.sendStatus(200);
};

/**
 * 로그아웃 클릭시 세션 정보를 삭제한다.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.logout = async (req, res) => {
    req.session && await req.session.destroy();
    res.redirect('/');
};
