const mysql = require('mysql2');
const mybatisMapper = require('mybatis-mapper');

let connection;

exports.init = async (host, database, user, password) => {
    mybatisMapper.createMapper(['./mapper/User.xml', './mapper/Board.xml']);

    const pool = mysql.createPool({
        host, user, password, database,
        waitForConnections: true,
        connectionLimit: 2,
        queueLimit: 0
    });
    connection = pool.promise();
    return connection;
};

exports.getConnection = () => {
    if (!connection) { return new Error('connection is no initialized!!'); }
    return connection;
};
