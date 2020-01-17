const User = require('../model/User');
const UserDao = require('../dao/UserDao');

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
