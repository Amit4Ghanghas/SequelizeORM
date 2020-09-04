module.exports = (sequelize, type) => {
    return sequelize.define('permissions', {
        permissionId: {
            type: type.STRING(64),
            primaryKey: true,
            // validate: {
            //     isUUID: 4
            // }
        },
        permissionBinary: {
            type: type.STRING.BINARY,
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        permissionTitle: {
            type: type.STRING(50),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        permissions: {
            type: type.ENUM('A', 'R', 'U', 'M', 'S', 'D'),
            allowNull: false,
            validate: {
                isAlpha: true
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
        // createdBy: {
        //     type: type.STRING(64),
        //     allowNull: false,
        //     validate: {
        //         isUUID: 4
        //     }
        // },
        // updatedBy: {
        //     type: type.STRING(64),
        //     validate: {
        //         isUUID: 4
        //     }
        // }
    })
}
