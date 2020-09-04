const { userRole, sequelize } = require('../config/sequelize');
const { response } = require('../utilities/responseStructure');

function get(data, callback) {
    try {
        let where = {};
        userRole.findAll(where)
        .then(res => {
            callback(null, res, { cl: 'userRole', where: where });
        })
        .catch(error => { callback(error); });
    } catch (error) {
        callback(error);
    }
}

async function add(data, callback) {
    console.log("Data---------",data);
    
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await userRole.create(
            data,
            { transaction }
        ).then(async () => {
            await transaction.commit();
            let success={
                userId:data.userId,
                roleId:data.roleId,
                status:"Success"
            }            
            callback(null, success);
        }).catch(async function (err) {
            let fail={
                userId:data.userId,
                roleId:data.roleId,
                status:"Failure"
            }
            await transaction.rollback(err);
            callback(fail);
        });
    } catch (error) {
        await transaction.rollback(error);
        callback(error);
    }
}

async function remove(data, callback) {
    let transaction;
    try {        
        transaction = await sequelize.transaction();
        await userRole.destroy(
            {
                where:
                {
                    userRoleId: data.userRoleId
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

 module.exports={
    get,
    add,
    remove
 }