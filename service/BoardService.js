const Board = require('../model/Board');
const User = require('../model/User');
const UserDao = require('../dao/UserDao');
const BoardDao = require('../dao/BoardDao');

/**
 * 게시판 목록 정보, 전체 갯수, 전체 페이지를 계산하여 반환한다.
 * @param page
 * @param perPage
 * @param searchType
 * @param searchTerm
 * @return {Promise<{totalCnt: (*|number), totalPage: number, boards: (*|Uint8Array|BigInt64Array|{createdAt: string, contents: (Document.contents|*|tl_board.contents|{allowNull, type}), id: *, title: *, userId: (Document.userId|*|tl_board_user.userId|{unique, allowNull, type}|tl_board.userId|{allowNull, type})}[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array)}>}
 */
exports.findBoardListWithPaging = async (page, perPage, searchType, searchTerm) => {
    // DB 검색 시작위치를 계산한다.
    const offset = page > 1 ? perPage * (page - 1) : 0;

    // DB에서 게시물 정보를 가져온다.
    const { boards, totalCnt, totalPage } =
        await BoardDao.findAllAngGetPagingData(offset, perPage, searchType, searchTerm);

    // HTML에서 보여줄 게시물 번호를 계산하여 for문에서 1씩 빼주면서 넣어준다.
    let startBoardNum = totalCnt - (page - 1) * perPage;
    for (const board of boards) {
        // 작성자 정보를 DB에서 찾아 넣어준다.
        const user = await UserDao.findByPk(board.userId);
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
