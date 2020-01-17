const mybatisMapper = require('mybatis-mapper');

let connection;
exports.init = (c) => {
    connection = c;
};

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

exports.save = async (userId, title, contents, fileName) => {
    const params = {userId, title, contents};
    if (fileName) {
        params.fileName = fileName;
    }

    const query = await mybatisMapper.getStatement('board', 'create', params);
    await connection.query(query);
};

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

exports.updateById = async (id, title, contents) => {
    const query = await mybatisMapper.getStatement('board', 'updateById', {
        id, title, contents
    });
    await connection.query(query);
};

exports.deleteById = async (id) => {
    const query = await mybatisMapper.getStatement('board', 'deleteById', { id });
    console.log(`query :: ${query}`);
    await connection.query(query);
};
