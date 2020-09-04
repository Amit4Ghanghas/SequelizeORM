module.exports = (sequelize, type) => {
    return sequelize.define('credentials', {
        credentialId: {
            type: type.STRING(64),
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        userId: {
            type: type.STRING(100),
            allowNull: false,
            // unique: true,
            validate: {
                isUUID: 4
            }
        },
        passwordSalt: {
            type: type.STRING(36),
            // allowNull: false,
            // validate: {
            //     isUUID: 4
            // }
        },
        email: {
            type: type.STRING,
            allowNull: false,
            // unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: type.STRING,
            // validate: {
            //     isAlphanumeric: true
            // },
            allowNull: false
        },
        isActive: {
            type: type.BOOLEAN,
            defaultValue: '1',
            validate: {
                isIn: [[-1, 0, 1]]
            }
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
            allowNull: false,
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
