const { roles, sequelize } = require('../config/sequelize');

function get(data, callback) {
    try {
        let where={}
        roles.findAll(
            //     {
            //     offset: req.query.page,
            //     limit: req.query.limit
            // }
        ).then(rolesRes => {
            callback(null, rolesRes,  { cl: 'roles', where: where });
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
        await roles.create(
            data,
            { transaction }
        ).then(async rolesRes => {
            await transaction.commit();
            callback(null, rolesRes);
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
        await roles.update(
            data.body,
            {
                where:
                {
                    roleId: data.roleId
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
        await roles.destroy(
            {
                where:
                {
                    roleId: data.roleId
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
    remove
}