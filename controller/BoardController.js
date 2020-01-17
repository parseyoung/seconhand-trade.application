const BoardService = require('../service/BoardService');
const UserService = require('../service/UserService');
const appRootPath = require('app-root-path');

/**
 * 게시판 목록을 출력한다.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.index = async (req, res) => {
    // 한페이지당 보여줄 게시물 갯수
    const perPage = req.query.perPage || 2;
    // 페이지 정보
    const page = req.query.page || 1;
    // 검색 조건 및 검색 단어
    let { searchType, searchTerm } = req.query;
    // 검색 조건이 title, contents중 하나라도 일치하지 않으면 기본으로 title로 지정한다.
    if (searchTerm && !['title', 'contents'].includes(searchType)) {
        searchType = 'title';
    }

    // 게시판 전체 페이지, 전체 갯수, 게시물 정보들을 가져온다.
    const { totalPage, totalCnt, boards } =
        await BoardService.findBoardListWithPaging(page, perPage, searchType, searchTerm);

    res.render('board/index.html', { boards, totalPage, totalCnt, currentPage: page, searchTerm, searchType });
};

/**
 * 게시판 입력 폼페이지를 출력한다.
 * 만약, 아이디가 파라미터로 들어오면 수정 페이지로 인식하여 아이디기준으로
 * 게시판 정보를 검색해 반환한다.
 * @param req
 * @param res
 * @return {Promise<void|undefined|String|Promise<String>|void|never|Response>}
 */
exports.formPage = async (req, res) => {
    // 게시판 아이디가 없으면 입력페이지를 출력한다.
    const boardId = req.params.id;
    if (!boardId) { return res.render('board/write.html', { board: {} }); }

    // 게시판 아이디를 기준으로 정보를 가져온다.
    const board = await BoardService.findByPk(boardId);
    // 아이디에 부합하는 정보가 없으면 수정할 수 없으므로 게시판 목록페이지로 이동시킨다.
    if (!board) { return res.redirect('/board'); }

    // 로그인한 사용자 정보와 게시판 사용자 정보가 일치하지않으면 수정하지 못하므로 목록페이지로 이동시킨다.
    const user = await UserService.findByUserId(req.session.userId);
    if (user.id !== board.userId) { return res.redirect('/board'); }

    res.render('board/write.html', { board });
};

/**
 * 게시판 삭제
 * @param req
 * @param res
 * @return {Promise<void|never|Response>}
 */
exports.delete = async (req, res) => {
    const boardId = req.body.id;
    const board = await BoardService.findByPk(boardId);
    const user = await UserService.findByUserId(req.session.userId);

    // 게시판 작성자 정보와 로그인 사용자 정보가 일치하지 않으면 목록페이지로 이동시킨다.
    if (user.id !== board.userId) { return res.redirect('/board'); }

    await BoardService.deleteById(board.id);

    res.redirect('/board');
};

/**
 * 게시판 출력페이지 이동시킨다.
 * @param req
 * @param res
 * @return {Promise<void|never|Response>}
 */
exports.viewPage = async (req, res) => {
    // 게시판 아이디에 부합하는 게시판 정보가 없으면 목록으로 이동시킨다.
    const board = await BoardService.findByPk(req.params.id);
    if (!board) { return res.redirect('/board'); }

    const user = await UserService.findByPk(board.userId);
    board.username = user.name;
    // 로그인 사용자 정보와 게시판 작성자가 같은지 확인한다. (수정, 삭제버튼 노출/미노출 판단)
    board.isOwner = user.userId === req.session.userId;

    res.render('board/view.html', { board });
};

/**
 * 게시판 내용을 DB에 저장시키며 업로드 파일이 있을경우 /upload 폴더에 파일을 저장시킨다.
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.save = async (req, res) => {
    const userId = req.session.userId;
    const { title, contents } = req.body;

    const user = await UserService.findByUserId(userId);
    let fileName;
    try {
        // 업로드 파일이 존재할 경우
        if (req.files && req.files.file && req.files.file.name !== '') {
            // 파일 객체를 가져온다.
            const file = req.files.file;
            // 파일명이 중복될수 있으므로 파일명_217584.jpg 형식으로 바꿔준다.
            fileName = file.name.split('.')[0] + '_' + Date.now() + '.' + file.name.split('.')[1];
            // /upload/ 폴더로 파일을 이동시킨다.
            const filePath = `${appRootPath}/upload/${fileName}`;
            await file.mv(filePath);
        }
        // 게시판 정보를 저장시킨다.
        await BoardService.save(user.id, title, contents, fileName);
    } catch (e) {
        console.error(`board save error :: ${e}`);
    }
    res.redirect('/board');
};

/**
 * 게시판 정보를 갱신한다.
 * @param req
 * @param res
 * @return {Promise<void|never|Response>}
 */
exports.update = async (req, res) => {
    const {id, title, contents} = req.body;

    // 수정할 게시판 정보가 있는지 확인하고 없으면 게시판 목록으로 이동시킨다.
    const board = await BoardService.findByPk(id);
    if (!board) { return res.redirect('/board'); }

    // 로그인 사용자와 게시판 작성 사용자 정보가 일치하지 않으면 목록으로 이동시킨다.
    const user = await UserService.findByUserId(req.session.userId);
    if (user.id !== board.userId) { return res.redirect('/board'); }

    // DB정보를 갱신한다.
    await BoardService.updateById(id, title, contents);

    // 게시판 출력 페이지로 이동한다.
    res.redirect(`/board/view/${id}`);
};

