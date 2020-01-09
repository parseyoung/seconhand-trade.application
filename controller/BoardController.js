const User = require('../model/User');
const Board = require('../model/Board');

exports.index = async (req, res) => {
    const boards = await Board.findAll();
    for (const board of boards) {
        const user = await User.findByPk(board.userId);
        board.username = user.name;
    }

    res.render('board/index.html', { boards });
};

exports.formPage = async (req, res) => {
    const boardId = req.params.id;
    if (!boardId) { return res.render('board/write.html', { board: {} }); }

    const board = await Board.findByPk(boardId);
    if (!board) { return res.redirect('/board'); }

    const user = await User.findByUserId(req.session.userId);
    if (user.id !== board.userId) { return res.redirect('/board'); }

    res.render('board/write.html', { board });
};

exports.delete = async (req, res) => {
    const boardId = req.body.id;
    const board = await Board.findByPk(boardId);
    const user = await User.findByUserId(req.session.userId);

    if (user.id !== board.userId) { return res.redirect('/board'); }

    await Board.deleteById(board.id);

    res.redirect('/board');
};

exports.viewPage = async (req, res) => {
    const board = await Board.findByPk(req.params.id);
    if (!board) { return res.redirect('/board'); }

    const user = await User.findByPk(board.userId);
    board.username = user.name;
    board.isOwner = user.userId === req.session.userId;

    res.render('board/view.html', { board });
};

exports.save = async (req, res) => {
    const userId = req.session.userId || 123;
    const { title, contents } = req.body;

    const user = await User.findByUserId(userId);
    try {
        await Board.save(user.id, title, contents);
    } catch (e) {
        console.error(`board save error :: ${e}`);
    }
    res.redirect('/board');
};

exports.update = async (req, res) => {
    const {id, title, contents} = req.body;

    const board = await Board.findByPk(id);
    if (!board) { return res.redirect('/board'); }

    const user = await User.findByUserId(req.session.userId);
    if (user.id !== board.userId) { return res.redirect('/board'); }

    await Board.updateById(id, title, contents);

    res.redirect(`/board/view/${id}`);
};
