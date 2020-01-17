const mybatisMapper = require('mybatis-mapper');

let connection;
exports.init = (c) => {
    connection = c;
};

exports.create = async (userId, password, name) => {
    const query = await mybatisMapper.getStatement('user', 'create', {
        userId, password, name
    });

    await connection.query(query);
};

exports.findByUserId = async (userId) => {
    const query = await mybatisMapper.getStatement('user', 'findByUserId', {
        userId
    });

    const [rows] = await connection.query(query);
    if (rows && rows[0]) { return rows[0]; }
    return null;
};

exports.findByPk = async (id) => {
    const query = await mybatisMapper.getStatement('user', 'findByPk', { id });

    const [rows] = await connection.query(query);
    if (rows && rows[0]) { return rows[0]; }
    return null;
};
