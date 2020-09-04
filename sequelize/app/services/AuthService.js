require('dotenv').config();
const { users, credentials, userRole, sequelize, userGroup } = require('../config/sequelize');
const bcrypt = require('bcryptjs');
const generateUUID = require('../utilities/uuidGenerator');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const { resetPasswordLink } = require('../services/PasswordService');
const s3url = require('../utilities/s3UrlShare');

async function register(data, callback) {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        let usersRes = await users.findAll({
            where: { email: data.email },
            raw: true
        });

        // User existing in database
        if (usersRes && usersRes.length != 0) {
            let error = 'Email Address Exists in Database.';
            callback(error);
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(data.password, salt, (err, hash) => {
                    if (err) throw err;
                    data.userId = generateUUID.uuid();
                    createUser(hash, data, transaction).then(createUserRes => {
                        callback(null, createUserRes);
                    }).catch(async err => {
                        await transaction.rollback(err);
                        callback(err);
                    });
                });
            });
        }
    } catch (error) {
        callback(error);
    }
}

async function createUser(hash, data, transaction) {
    try {
        await users.create({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.firstName + ' ' + data.lastName,
            email: data.email,
            phone: data.phone,
            createdBy: data.userId,
            profile_image: data.profile_image || null
        },
            { transaction });
        await credentials.create({
            credentialId: generateUUID.uuid(),
            userId: data.userId,
            passwordSalt: '',
            createdBy: data.userId,
            email: data.email,
            password: hash
        },
            { transaction });
        if (data.roleId) {
            await userRole.create({
                userRoleId: generateUUID.uuid(),
                userId: data.userId,
                roleId: data.roleId,
                createdBy: data.userId
            },
                { transaction });
        }
        if (data.groupId) {
            await userGroup.create({
                userGroupId: generateUUID.uuid(),
                userId: data.userId,
                groupId: data.groupId,
                createdBy: data.userId
            },
                { transaction });
        }
        await transaction.commit();
        let response = { message: 'Success', userId: data.userId };
        return response;
    } catch (error) {
        console.log(error);

        await transaction.rollback(error);
        return (error);
    }
}

function login(data, callback) {
    try {
        let sql = `SELECT 
        u.*,
        (SELECT 
                password
            FROM
                credentials
            WHERE
                userId = u.userId) AS password,
        (SELECT 
                roleId
            FROM
                user_roles ur
            WHERE
                userId = u.userId) AS roleId,
        (SELECT 
                name
            FROM
                roles
            WHERE
                roleId = (SELECT 
                        roleId
                    FROM
                        user_roles ur
                    WHERE
                        userId = u.userId)) AS roleName,
        (SELECT 
                groupId
            FROM
                user_groups ug
            WHERE
                userId = u.userId) AS groupId,
        (SELECT 
                name
            FROM
                groups
            WHERE
                groupId = (SELECT 
                        groupId
                    FROM
                        user_groups ur
                    WHERE
                        userId = u.userId)) AS groupName
    FROM
        users u
    WHERE
        email = '${data.email}';`
        sequelize.query(sql, { raw: true, plain: true })
            .then(usersRes => {
                console.log("UserRes-----", usersRes);

                if (!usersRes || (usersRes && usersRes.length === 0)) {
                    let error = "No Account Found";
                    callback(error)
                } else {
                    bcrypt.compare(data.password, usersRes.password)
                        .then(isMatch => {
                            if (isMatch) {
                                const payload = {
                                    id: usersRes.userId,
                                    name: usersRes.fullName
                                };
                                jwt.sign(payload, secret, { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY) },
                                    async (err, token) => {
                                        if (err)
                                            callback("Error signing token")
                                        else {
                                            callback(null, {
                                                // success: true,
                                                token: `Bearer ${token}`,
                                                userId: usersRes.userId,
                                                firstName: usersRes.firstName,
                                                lastName: usersRes.lastName,
                                                fullName: usersRes.fullName,
                                                profile_image: usersRes.profile_image ? (await s3url.url(usersRes.profile_image)) : null,
                                                email: usersRes.email,
                                                phone: usersRes.phone,
                                                roleId: usersRes.roleId,
                                                roleName: usersRes.roleName,
                                                groupId: usersRes.groupId,
                                                groupName: usersRes.groupName,
                                            });
                                        }
                                    });
                            } else {
                                callback("Password is incorrect");
                            }
                        })
                        .catch(error => {
                            console.log("Error----", error);

                            callback(error);
                        });
                }
            })

            .catch(error => { callback(error); });

    } catch (error) {
        callback(error);
    }
}

async function registerUser(data, callback) {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        let usersRes = await users.findAll({
            where: { email: data.email },
            raw: true
        });
        // User existing in database
        if (usersRes && usersRes.length != 0) {
            let error = 'Email Address Exists in Database.';
            callback(error);
        } else {
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) throw err;
                bcrypt.hash(data.password, salt, async (err, hash) => {
                    if (err) throw err;
                    data.userId = generateUUID.uuid();
                    console.log(data);

                    createUser(hash, data, transaction).then(async createUserRes => {
                        createUserRes.link = await resetPasswordLink(data.userId);
                        callback(null, createUserRes);
                    }).catch(async err => {
                        console.log(err);

                        await transaction.rollback(err);
                        callback(err);
                    });
                });
            });
        }
    } catch (error) {
        callback(error);
    }
}


module.exports = {
    register,
    registerUser,
    login
}