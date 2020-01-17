const Board = require('../model/Board');
const User = require('../model/User');
const BoardDao = require('../dao/BoardDao');

exports.findBoardListWithPaging = async (page, perPage, searchType, searchTerm) => {
    const offset = page > 1 ? perPage * (page - 1) : 0;

    const { boards, totalCnt, totalPage } =
        await BoardDao.findAllAngGetPagingData(offset, perPage, searchType, searchTerm);

    let startBoardNum = totalCnt - (page - 1) * perPage;
    for (const board of boards) {
        const user = await User.findByPk(board.userId);
        board.username = user.name;
        board.num = startBoardNum--;
    }

    return { boards, totalCnt, totalPage };
};

// exports.findByPk = Board.findByPk;
exports.findByPk = BoardDao.findByPk;
// exports.deleteById = Board.deleteById;
exports.deleteById = BoardDao.deleteById;
// exports.save = Board.save;
exports.save = BoardDao.save;
// exports.updateById = Board.updateById;
exports.updateById = BoardDao.updateById;
