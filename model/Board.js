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
    const result = await _board.create({ userId, title, contents });
    console.log(`######## result.id :: ${result}`);
};

exports.save = async (userId, title, contents) => {
    const result = _board.create({ userId, title, contents });
    console.log(`######## result.id :: ${result}`);
};

exports.findByPk = async (id) => {
    const board = await _board.findByPk(id);
    if (!board) return null;

    return {
        id: board.id,
        title: board.title,
        contents: board.contents,
        createdAt: new Date(board.createdAt).toLocaleString(),
        updatedAt: new Date(board.updatedAt).toLocaleString(),
        userId: board.userId
    };
};

exports.findAll = async () => {
    const boards = await _board.findAll({
        order: [ ['id', 'desc'] ]
    });
    return boards.map(b => {
        return {
            id: b.id,
            title: b.title,
            contents: b.contents,
            createdAt: new Date(b.createdAt).toLocaleString(),
            userId: b.userId
        }
    })
};

exports.deleteById = async (id) => {
    _board.destroy({ where: {id} })
};

exports.updateById = async (id, title, contents) => {
    await _board.update({ title, contents }, { where: {id} });
};
