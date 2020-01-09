const Sequelize = require('sequelize');

let _board;

exports.init = async (sequelize) => {
    _board = await sequelize.define('tl_board', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contents: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'board',
        tableName: 'tl_board'
    });
};

exports.sync = async (force) => {
    _board && await _board.sync({ force });
};

exports.save = async (userId, title, contents) => {
    const result = _board.create({ userId, title, contents });
    console.log(`######## result.id :: ${result}`);
};

exports.findAll = async () => {
    const boards = await _board.findAll();
    return boards.map(b => {
        return {
            title: b.title,
            contents: b.contents,
            createdAt: new Date(b.createdAt).toLocaleString(),
            userId: b.userId
        }
    })
};
