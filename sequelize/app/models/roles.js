module.exports = (sequelize, type) => {
    return sequelize.define('roles', {
        roleId: {
            type: type.STRING(64),
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        name: {
            type: type.STRING(100),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        description: {
            type: type.STRING,
            allowNull: false,
            validate: {
                is: /^[^;]*$/i
            }
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
    })
}
