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
    res.render('board/write.html', { });
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
