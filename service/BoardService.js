const Board = require('../model/Board');
const User = require('../model/User');

exports.findBoardList = async () => {
    const boards = await Board.findAll();
    for (const board of boards) {
        const user = await User.findByPk(board.userId);
        board.username = user.name;
    }

    return boards;
};

exports.findByPk = Board.findByPk;
exports.deleteById = Board.deleteById;
exports.save = Board.save;
exports.updateById = Board.updateById;
