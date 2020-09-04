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

const users = usersModel(sequelize, Sequelize);
const credentials = credentialsModel(sequelize, Sequelize);
const permissions = permissionsModel(sequelize, Sequelize);
const features = featuresModel(sequelize, Sequelize);
const roles = rolesModel(sequelize, Sequelize);
const groupRoles = groupRolesModel(sequelize, Sequelize);
const groups = groupsModel(sequelize, Sequelize);
const roleFeature = roleFeatureModel(sequelize, Sequelize);
const userGroup = userGroupModel(sequelize, Sequelize);
const userRole = userRoleModel(sequelize, Sequelize);

users.hasMany(credentials, { foreignKey: 'userId' });
groups.hasMany(groupRoles, { foreignKey: 'groupId' });
roles.hasMany(groupRoles, { foreignKey: 'roleId' });
roles.hasMany(roleFeature, { foreignKey: 'roleId' });
features.hasMany(roleFeature, { foreignKey: 'featureId' })
users.hasOne(userGroup, { foreignKey: 'userId' });
groups.hasMany(userGroup, { foreignKey: 'groupId' });
users.hasOne(userRole, { foreignKey: 'userId' });
roles.hasMany(userRole, { foreignKey: 'roleId' });

//Create Existing Role
const defaultPermissions = [
    {
        permissionId: '1',
        permissionBinary: '1000001',
        permissionTitle: 'add',
        permissions: 'A'
    },
    {
        permissionId: '2',
        permissionBinary: '1010101',
        permissionTitle: 'update',
        permissions: 'U'
    },
    {
        permissionId: '3',
        permissionBinary: '1010010',
        permissionTitle: 'read',
        permissions: 'R'
    },
    {
        permissionId: '4',
        permissionBinary: '1000100',
        permissionTitle: 'delete',
        permissions: 'D'
    },
    {
        permissionId: '5',
        permissionBinary: '1010011',
        permissionTitle: 'sendSMS',
        permissions: 'S'
    },
    {
        permissionId: '6',
        permissionBinary: '1001101',
        permissionTitle: 'sendMail',
        permissions: 'M'
    }
];

//Create Admin Account
const defaultRoles = [
    {
        roleId: '1',
        name: 'superadmin',
        description: 'Platform Admin'
    },
    {
        roleId: '2',
        name: 'admin',
        description: 'Company Admin or owner'
    },
    {
        roleId: '3',
        name: 'sales',
        description: 'Sales Executive'
    }
];

const defaultGroups = [
    {
        groupId: '1',
        name: 'platformAdmin',
        description: 'Platform Admin'
    },
    {
        groupId: '2',
        name: 'builder',
        description: 'Builder'
    },
    {
        groupId: '3',
        name: 'broker',
        description: 'Broker'
    }
];
//TODOO
// const defaultGroupRoles=[
//     {
//         groupRoleId:'1',
//         groupId:'1',
//         roleId:'1'
//     },
//     {
//         groupRoleId:'2',
//         groupId:'1',
//         roleId:'1'
//     }
// ]


const platformAdmin = {
    userId: '32fe6ccc-c170-4ae3-997f-5e02bfce6505',
    firstName: 'BB',
    lastName: 'Admin',
    fullName: 'BB Admin',
    profile_image:'https://builder-broadcast.s3.ap-south-1.amazonaws.com/image/1593472875412.jpg',
    email: 'bb.communication2020@gmail.com',
    phone: '9999999999',
    createdBy: '32fe6ccc-c170-4ae3-997f-5e02bfce6505'
};

var platformAdminCredentials = {
    credentialId: '139bb8b3-76ba-48ab-9ad7-1e4fc6162df8',
    userId: platformAdmin.userId,
    passwordSalt: '',
    createdBy: platformAdmin.userId,
    email: platformAdmin.email,
    password: '$2a$10$oPI.xpLwlL4/zQlRF3W0d./bzfs/KMzkGALzZpqyPrrXT9TjlsTs6'        //abc12345
}
var adminUserRoles = {
    userRoleId: 'aea32993-4d2d-4db6-bc02-eadcafc5f727',
    userId: platformAdmin.userId,
    roleId: '1'
}

var adminUserGroup = {
    userGroupId: '0109b177-246f-4755-8d20-e7f8aefd0838',
    userId: platformAdmin.userId,
    groupId: '1'
};

async function start() {
    await sequelize.sync({
        force: false,
        //  alter : true
    })
        .then(async () => {
            console.log(`Database & tables created here!`)
            await permissions.bulkCreate(defaultPermissions).catch(err => {
                console.log("Error While Adding Permissions Default Value");
            });
            await roles.bulkCreate(defaultRoles);
            await groups.bulkCreate(defaultGroups);
            await users.create(platformAdmin);
            await credentials.create(platformAdminCredentials);
            await userRole.create(adminUserRoles);
            await userGroup.create(adminUserGroup);
        })
        .catch(error => {
            console.log("Error: ", error);
        });
}

module.exports = {
    start
}