module.exports = (sequelize, type) => {
    return sequelize.define('user_role', {
        userRoleId: {
            type: type.STRING(64),
            primaryKey: true
            // validate: {
            //     isUUID: 4
            // }
        },
        userId: {
            type: type.STRING(64),
            allowNull: false
            // validate: {
            //     isUUID: 4
            // }
        },
        roleId: {
            type: type.STRING(64),
            allowNull: false
            // validate: {
            //     isUUID: 4
            // }
        },
        isActive: {
            type: type.BOOLEAN,
            validate: {
                isIn: [[-1, 0, 1]]
            },
            defaultValue: '1'
        },
        isRemoved: {
            type: type.BOOLEAN,
            validate: {
                isIn: [[-1, 0, 1]]
            },
            defaultValue: '0'
        },
        createdBy: {
            type: type.STRING(64),
            // allowNull: false,
            validate: {
                isUUID: 4
            }
        },
        updatedBy: {
            type: type.STRING(64),
            validate: {
                isUUID: 4
            }
        }
    },
        {
            indexes: [
                { fields: ['userId', 'roleId'], unique: true }
            ]
        }
    )
}
