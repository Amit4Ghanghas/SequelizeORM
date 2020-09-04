const { features, sequelize } = require('../config/sequelize');

function get(data, callback) {
    try {
        let where = {};
        features.findAll(where)
        .then(featuresRes => {
            callback(null, featuresRes, { cl: 'features', where: where });
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
        await features.create(
            data,
            { transaction }
        ).then(async featuresRes => {
            await transaction.commit();
            callback(null, featuresRes);
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
        await features.update(
            data.body,
            {
                where:
                {
                    featureId: data.featureId
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
        await features.destroy(
            {
                where:
                {
                    featureId: data.featureId
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