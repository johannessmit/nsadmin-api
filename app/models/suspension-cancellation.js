'use strict'
const userService = require('../services/user')
const discordMessageJob = require('../jobs/discord-message')
const cron = require('node-schedule')

module.exports = (sequelize, DataTypes) => {
    const SuspensionCancellation = sequelize.define('SuspensionCancellation', {
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
        }
    }, {
        hooks: {
            afterCreate: async cancellation => {
                const suspension = await sequelize.models.Suspension.unscoped().findByPk(cancellation.suspensionId)
                const [username, authorName] = await Promise.all([userService.getUsername(suspension.userId),
                    userService.getUsername(cancellation.authorId)])
                const job = cron.scheduledJobs[`suspension_${suspension.id}`]
                if (job) job.cancel()
                discordMessageJob('log', `**${authorName}** cancelled **${username}**'s suspension with `
                    + `reason "*${cancellation.reason}*"`)
            }
        },
        tableName: 'suspension_cancellations'
    })

    SuspensionCancellation.associate = models => {
        SuspensionCancellation.belongsTo(models.Suspension, {
            foreignKey: { allowNull: false, name: 'suspensionId' },
            onDelete: 'cascade',
            hooks: true
        })
    }

    return SuspensionCancellation
}
