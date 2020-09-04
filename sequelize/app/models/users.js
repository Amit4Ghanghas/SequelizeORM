module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        userId: {
            type: type.STRING(64),
            primaryKey: true,
            // validate: {
            //     isUUID: 4
            // }
        },
        firstName: {
            type: type.STRING(100),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        lastName: {
            type: type.STRING(100),
            // allowNull: false,
            // validate: {
            //     isAlpha: true
            // }
        },
        fullName: {
            type: type.STRING(200),
            // allowNull: false
            // validate: {
            //     isAlpha: true
            // }
        },
        email: {
            type: type.STRING,
            validate: {
                isEmail: true
            },
            allowNull: false,
            unique: true
        },
        phone: {
            type: type.STRING,
            unique: true,
            // validate: {
            //     is: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/i
            // }
        },
        profile_image: {
            type: type.STRING,
            // unique: true,
            // validate: {
            //     is: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/i
            // }
        },
        online:{
            type: type.BOOLEAN,
            defaultValue: '0',
            validate: {
                isIn: [[0, 1]]
            }
        },
        sortOrder: {
            type: type.DOUBLE,
            defaultValue: '0'
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
            defaultValue: '0',
            validate: {
                isIn: [[-1, 0, 1]]
            }
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
            // allowNull: false
        }
    })
}
