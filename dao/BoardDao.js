const mybatisMapper = require('mybatis-mapper');

let connection;
exports.init = (c) => {
    connection = c;
};

/**
 * 게시판 목록 정보, 전체 갯수, 전체 페이지를 계산하여 반환한다.
 * @param offset 검색 시작 위치
 * @param limit 검색 갯수
 * @param searchType 검색 컬럼
 * @param searchTerm 검색 단어
 * @return {Promise<{totalCnt: (*|number), totalPage: number, boards: (*|Uint8Array|BigInt64Array|{createdAt: string, contents: (Document.contents|*|tl_board.contents|{allowNull, type}), id: *, title: *, userId: (Document.userId|*|tl_board_user.userId|{unique, allowNull, type}|tl_board.userId|{allowNull, type})}[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array)}>}
 */
exports.findAllAngGetPagingData = async (offset, limit, searchType, searchTerm) => {
    const countQuery = await mybatisMapper.getStatement('board', 'countWithSearch', {
        searchColumn: searchType,
        searchTerm: searchTerm || null
    });

    const [countRows] = await connection.query(countQuery);
    const totalCnt = countRows[0].count || 0;

    const findQuery = await mybatisMapper.getStatement('board', 'findWithSearch', {
        searchColumn: searchType,
        searchTerm: searchTerm || null,
        offset,
        limit
    });

    const [boardRows] = await connection.query(findQuery);
    const boards = boardRows.map(b => {
        return {
            id: b.id,
            title: b.title,
            contents: b.contents,
            createdAt: new Date(b.createdAt).toLocaleString(),
            userId: b.userId
        }
    });

    return {
        boards,
        totalCnt,
        totalPage: Math.ceil(totalCnt / limit)
    };
};

/**
 * 게시판 정보를 DB에 입력한다.
 * @param userId 유저아이디
 * @param title 제목
 * @param contents 내용
 * @param fileName 업로드 파일명
 * @return {Promise<void>}
 */
exports.save = async (userId, title, contents, fileName) => {
    const params = {userId, title, contents};
    if (fileName) {
        params.fileName = fileName;
    }

    const query = await mybatisMapper.getStatement('board', 'create', params);
    await connection.query(query);
};

/**
 * 게시판 아이디(PK)를 기준으로 DB에서 데이터를 가져와 반환한다.
 * @param id 게시판 아이디
 * @return {Promise<null|{createdAt: string, fileName: (*|tl_board.fileName|{allowNull, type}), contents: (Document.contents|*|tl_board.contents|{allowNull, type}), id: *, title: *, userId: (Document.userId|*|tl_board.userId|{allowNull, type}|tl_board_user.userId|{unique, allowNull, type}), updatedAt: string}>}
 */
exports.findByPk = async (id) => {
    const query = await mybatisMapper.getStatement('board', 'findByPk', {id});
    const [row] = await connection.query(query);

    if (!row || !row[0]) { return null; }

    const board = row[0];
    return {
        id: board.id,
        title: board.title,
        contents: board.contents,
        createdAt: new Date(board.createdAt).toLocaleString(),
        updatedAt: new Date(board.updatedAt).toLocaleString(),
        userId: board.userId,
        fileName: board.fileName
    };
};

/**
 * 게시판 정보를 아이디 기준으로 갱신한다.
 * @param id 게시판 아이디
 * @param title 게시판 제목
 * @param contents 게시판 내용
 * @return {Promise<void>}
 */
exports.updateById = async (id, title, contents) => {
    const query = await mybatisMapper.getStatement('board', 'updateById', {
        id, title, contents
    });
    await connection.query(query);
};

/**
 * 게시판 정보를 아이디를 기준으로 삭제한다.
 * @param id 게시판 아이디
 * @return {Promise<void>}
 */
exports.deleteById = async (id) => {
    const query = await mybatisMapper.getStatement('board', 'deleteById', { id });
    await connection.query(query);
};
