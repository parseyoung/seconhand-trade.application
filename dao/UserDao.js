const mybatisMapper = require('mybatis-mapper');

let connection;
/**
 * DB 커넥션 객체를 내부에 가지고있는다.
 * @param c
 */
exports.init = (c) => {
    connection = c;
};

/**
 * 회원 정보를 DB에 저장시킨다.
 * @param userId 유저 아이디
 * @param password 유저 비밀번호
 * @param name 유저 이름
 * @return {Promise<void>}
 */
exports.create = async (userId, password, name) => {
    const query = await mybatisMapper.getStatement('user', 'create', {
        userId, password, name
    });

    await connection.query(query);
};

/**
 * Mybatis를 통해 userId를 기준으로 회원 정보를 DB에서 가져와 반환한다.
 * @param userId 유저 아이디
 * @return {Promise<null|*>}
 */
exports.findByUserId = async (userId) => {
    const query = await mybatisMapper.getStatement('user', 'findByUserId', {
        userId
    });

    const [rows] = await connection.query(query);
    if (rows && rows[0]) { return rows[0]; }
    return null;
};

/**
 * 유저 테이블의 PK(id)를 기준으로 데이터를 가져온다.
 * @param id
 * @return {Promise<null|*>}
 */
exports.findByPk = async (id) => {
    const query = await mybatisMapper.getStatement('user', 'findByPk', { id });

    const [rows] = await connection.query(query);
    if (rows && rows[0]) { return rows[0]; }
    return null;
};
