const { users, sequelize } = require('../config/sequelize');

function get(data, callback) {
    try {
        let where = {}
        users.findAll({
            attributes: ['userId', 'firstName', 'lastName', 'email', 'phone', 'isActive', 'isRemoved', 'createdAt', 'updatedAt']
        }
        ).then(usersRes => {
            callback(null, usersRes, { cl: 'users', where: where });
        })
            .catch(error => { callback(error); });
    } catch (error) {
        callback(error);
    }
}

function getById(data, callback) {
    try {
        let where = { userId: data.userId };
        users.findAll({
            attributes: ['userId', 'firstName', 'lastName', 'email', 'phone', 'isActive', 'isRemoved', 'createdAt', 'updatedAt'],
            where: where
        }
        ).then(usersRes => {
            callback(null, usersRes, { cl: 'users', where: where });
        })
            .catch(error => { callback(error); });
    } catch (error) {
        callback(error);
    }
}


async function add(data, callback) {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await users.create(
            data,
            { transaction }
        ).then(async usersRes => {
            await transaction.commit();
            callback(null, usersRes);
        }).catch(async function (err) {
            await transaction.rollback(err);
            callback(err);
        });
    } catch (error) {
        await transaction.rollback(error);
        callback(error);
    }
}

async function edit(data, callback) {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await users.update(
            data.body,
            {
                where:
                {
                    userId: data.userId
                }
            },
            { transaction }
        ).then(async result => {
            await transaction.commit();
            callback(null, result);
        }).catch(async err => {
            await transaction.rollback(err);
            callback(err);
        });
    } catch (error) {
        await transaction.rollback(err);
        callback(err);
    }
}

async function remove(data, callback) {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await users.destroy(
            {
                where:
                {
                    userId: data.userId
                }
            },
            { transaction }
        ).then(async result => {
            await transaction.commit();
            callback(null, result);
        }).catch(async err => {
            await transaction.rollback(err);
            callback(err);
        });
    } catch (error) {
        await transaction.rollback(err);
        callback(err);
    }
}

module.exports = {
    get,
    add,
    edit,
    remove,
    getById
}