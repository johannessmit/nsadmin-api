'use strict'
const { userService } = require('../services')
const { discordMessageJob } = require('../jobs')
const pluralize = require('pluralize')

module.exports = (sequelize, DataTypes) => {
    const Suspension = sequelize.define('Suspension', {
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'author_id'
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rankBack: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: 'rank_back'
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        finished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        endDate: {
            type: DataTypes.VIRTUAL,
            async get () {
                let duration = this.duration
                const extensions = await sequelize.models.SuspensionExtension.findAll({
                    where: { suspensionId: this.id }
                })
                for (const extension of extensions) {
                    duration += extension.duration
                }
                return new Date(this.date.getTime() + duration)
            }
        }
    }, {
        hooks: {
            async afterCreate (suspension) {
                const days = suspension.duration / 86400000
                const [username, authorName] = await Promise.all([userService.getUsername(suspension.userId),
                    userService.getUsername(suspension.authorId)])
                discordMessageJob.run('log', `**${authorName}** suspended **${username}** for **${
                    days}** ${pluralize('day', days)} with reason "*${suspension.reason}*"`)
            },

            async afterUpdate (suspension, options) {
                const [username, editorName] = await Promise.all([userService.getUsername(suspension.userId),
                    userService.getUsername(options.editorId)])
                if (suspension.changed('authorId')) {
                    const authorName = await userService.getUsername(suspension.authorId)
                    discordMessageJob.run('log', `**${editorName}** changed the author of **${
                        username}**'s suspension to **${authorName}**`)
                }
                if (suspension.changed('reason')) {
                    discordMessageJob.run('log', `**${editorName}** changed the reason of **${
                        username}**'s suspension to *"${suspension.reason}"*`)
                }
                if (suspension.changed('rankBack')) {
                    discordMessageJob.run('log', `**${editorName}** changed the rankBack option of **${
                        username}**'s suspension to **${suspension.rankBack ? 'yes' : 'no'}**`)
                }
            }
        },
        tableName: 'suspensions'
    })

    Suspension.associate = function (models) {
        Suspension.hasOne(models.SuspensionCancellation, {
            foreignKey: { allowNull: false, name: 'suspensionId' }
        })
        Suspension.hasMany(models.SuspensionExtension, {
            foreignKey: { allowNull: false, name: 'suspensionId' },
            as: 'extensions'
        })
    }

    Suspension.loadScopes = function (models) {
        Suspension.addScope('defaultScope', {
            where: { '$SuspensionCancellation.id$': null, finished: false },
            include: [{
                model: models.SuspensionCancellation,
                attributes: [],
            }, {
                model: models.SuspensionExtension,
                as: 'extensions'
            }],
            subQuery: false
        })
        Suspension.addScope('finished', {
            where: { '$SuspensionCancellation.id$': null, finished: true },
            include: [{
                model: models.SuspensionCancellation,
                attributes: [],
            }, {
                model: models.SuspensionExtension,
                as: 'extensions'
            }],
            subQuery: false
        })
    }

    return Suspension
}
