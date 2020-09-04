const { users, credentials, sequelize } = require('../config/sequelize');
const { getCache, setCache } = require('../utilities/cache');
const generateUUID = require('../utilities/uuidGenerator');
const bcrypt = require('bcryptjs');

var resetPasswordLink = async (userId) => {
    console.log("User Id in reset password link-------", userId);
    const keyName = generateUUID.uuid();
    console.log("UUID Key for reset password", keyName);

    var set = await setCache(keyName, userId, 30 * 60 * 1000).catch(err => {
        console.log("Error in Set Password Service----", err);
    });
    console.log("Set Password in Password Service---", set);
    return 'http://localhost:4200/auth/rp/' + keyName;
}

async function resetPassword(data, callback) {
    try {
        console.log("Hi", typeof (data.uuid));

        var userId = await getCache(data.uuid);
        console.log("Get Value------", userId);
        if (userId) {
            let transaction;
            transaction = await sequelize.transaction();

            let usersRes = await users.findAll({
                include: [
                    {
                        model: credentials,
                        where: { userId: userId }
                    }
                ],
                raw: true
            });
            console.log("UserRes-----", usersRes);
            console.log("Credential ID-----", usersRes[0]['credentials.credentialId']);

            // User existing in database
            if (!usersRes && usersRes.length == 0) {
                let error = 'User Doesnot Exists';
                callback(error);
            } else {
                bcrypt.genSalt(10, async (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(data.password, salt, async (err, hash) => {
                        if (err) throw err;
                        data.userId = generateUUID.uuid();
                        await credentials.update(
                            {
                                password: hash
                            },
                            {
                                where:
                                {
                                    credentialId: usersRes[0]['credentials.credentialId']
                                }
                            },
                            { transaction })
                        // console.log({
                        //     credentialId: generateUUID.uuid(),
                        //     userId: userId,
                        //     passwordSalt: '',
                        //     createdBy: userId,
                        //     email: usersRes[0].email,
                        //     password: hash
                        // });

                        // await credentials.create({
                        //     credentialId: "8b62227d-b624-446a-8dbf-081d440c8264",
                        //     userId: userId,
                        //     passwordSalt: '',
                        //     createdBy: userId,
                        //     email: usersRes[0].email,
                        //     password: hash
                        // },
                        //     { transaction }).catch(err => {
                        //         console.log("Error in creating credentials---", err);
                        //     });
                        callback(null, { status: true, message: "Password successfully updated" })
                    });
                    // await transaction.commit();        

                });
            }
        } else {

            callback("Link Expired");

        }


    } catch (error) {
        // await transaction.rollback(error);
        console.log(error);

        callback(error);
    }
}

module.exports = {
    resetPassword,
    resetPasswordLink
};