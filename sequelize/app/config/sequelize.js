const Sequelize = require('sequelize');

const credentialsModel = require('../models/credentials');
const featuresModel = require('../models/features');
const groupRolesModel = require('../models/groupRoles');
const groupsModel = require('../models/groups');
const permissionsModel = require('../models/permissions');
const roleFeatureModel = require('../models/roleFeature');
const rolesModel = require('../models/roles');
const userGroupModel = require('../models/userGroup');
const userRoleModel = require('../models/userRole');
const usersModel = require('../models/users');

const { DATABASE_NAME, USER, PASSWORD, HOST, DIALECT } = require('./databaseConnection');

const sequelize = new Sequelize(DATABASE_NAME, USER, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const credentials = credentialsModel(sequelize, Sequelize);
const features = featuresModel(sequelize, Sequelize);
const groupRoles = groupRolesModel(sequelize, Sequelize);
const groups = groupsModel(sequelize, Sequelize);
const permissions = permissionsModel(sequelize, Sequelize);
const roleFeature = roleFeatureModel(sequelize, Sequelize);
const roles = rolesModel(sequelize, Sequelize);
const userGroup = userGroupModel(sequelize, Sequelize);
const userRole = userRoleModel(sequelize, Sequelize);
const users = usersModel(sequelize, Sequelize);

users.hasMany(credentials, { foreignKey: 'userId' });
groups.hasMany(groupRoles, { foreignKey: 'groupId' });
roles.hasMany(groupRoles, { foreignKey: 'roleId' });
roles.hasMany(roleFeature, { foreignKey: 'roleId' });
features.hasMany(roleFeature, { foreignKey: 'featureId' })
users.hasOne(userGroup, { foreignKey: 'userId' });
groups.hasMany(userGroup, { foreignKey: 'groupId' });
users.hasOne(userRole, { foreignKey: 'userId' });
roles.hasMany(userRole, { foreignKey: 'roleId' });
groups.hasMany(userGroup, { foreignKey: 'groupId' });

// sequelize.sync({
//     force: false,
//     //  alter : true
// }).then(() => {
//     console.log(`Database & tables created here!`)
// }).catch(err => {
//     console.log("Error------", err);
// })
module.exports = {
    credentials,
    features,
    groupRoles,
    groups,
    permissions,
    roleFeature,
    roles,
    userGroup,
    userRole,
    users,
    sequelize
}