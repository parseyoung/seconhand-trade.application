const User = require('../model/User');
const UserDao = require('../dao/UserDao');

/**
 * Mybatis를 통해서 새로운 회원정보블 DB에 입력한다.
 * @param userId 유저아이디
 * @param password 비밀번호
 * @param username 유저이름
 * @return {Promise<boolean>}
 */
exports.createNewOne = async function (userId, password, username) {
    try {
        // await User.create(userId, password, username);
        await UserDao.create(userId, password, username);
        return true;
    } catch (e) {
        console.error('user create error :: ', e);
        return false;
    }
};

// exports.findByPk = User.findByPk;
exports.findByPk = UserDao.findByPk;
// exports.findByUserId = User.findByUserId;
exports.findByUserId = UserDao.findByUserId;
