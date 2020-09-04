module.exports = (sequelize, type) => {
    return sequelize.define('features', {
        featureId: {
            type: type.STRING(64),
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        name: {
            type: type.STRING(150),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        application: {
            type: type.STRING(100),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        parent: {
            type: type.STRING(200),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        sortOrder: {
            type: type.DOUBLE,
            defaultValue: '0'
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
            // allowNull: false
        }
    })
}
