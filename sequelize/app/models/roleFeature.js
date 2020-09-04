module.exports = (sequelize, type) => {
    return sequelize.define('role_feature', {
        roleFeatureId: {
            type: type.STRING(64),
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        roleId: {
            type: type.STRING(64),
            allowNull: false,
            validate: {
                isUUID: 4
            }
        },
        featureId: {                                                    //Doubt
            type: type.STRING(64),
            allowNull: false,
            validate: {
                isUUID: 4
            }
        },
        permissions: {
            type: type.STRING(10),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        isActive: {
            type: type.BOOLEAN,
            validate: {
                isIn: [[-1, 0, 1]]
            }
        },
        isRemoved: {
            type: type.BOOLEAN,
            validate: {
                isIn: [[-1, 0, 1]]
            },
            defaultValue: 0
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
