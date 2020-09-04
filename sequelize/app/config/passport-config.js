const { Strategy, ExtractJwt } = require('passport-jwt');
//this is using ES6 Destructuring. If you're not using a build step,
//this could cause issues and is equivalent to
// const pp-jwt = require('passport-jwt');
// const Strategy = pp-jwt.Strategy;
// const ExtractJwt = pp-jwt.ExtractJwt;
require('dotenv').config();
const secret = process.env.JWT_SECRET;
// const mongoose = require('mongoose');
// const User = require('./models/user');
const { users, userRole, userGroup, groups, roles } = require('./sequelize');
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};
//this sets how we handle tokens coming from the requests that come
// and also defines the key to be used when verifying the token.

//This will return token info in next middleware in req.user
module.exports = async passport => {
    passport.use(
        new Strategy(opts, async (payload, done) => {
            // console.log("In Token Verification")
            users.findAll({
                where: {
                    userId: payload.id
                },
                raw: true
            }).then(async user => {
                // console.log("User Exists and token verified-----------------", user)
                var role = await roles.findAll({
                    include: [
                        {
                            model: userRole,
                            where: {
                                userId: payload.id
                            }
                        }
                    ],
                    raw: true
                });

                var group = await groups.findAll({

                    include: [
                        {
                            model: userGroup,
                            where: {
                                userId: payload.id
                            }
                        }
                    ],
                    raw: true
                })

                if (user && role && group) {
                    return done(null, {
                        userId: user[0].userId,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        fullName: user[0].fullName,
                        email: user[0].email,
                        phone: user[0].phone,
                        roleId: role[0].roleId,
                        roleName: role[0].name,
                        groupId: group[0].groupId,
                        groupName: group[0].name
                    });
                }
                return done(null, false);
            }).catch(err => console.error(err));
        })
    );
};