'use strict'
const { userService, groupService } = require('../services')
const { discordMessageJob } = require('./')

const robloxConfig = require('../../config/roblox')

module.exports = async suspension => {
    const rank = await userService.getRank(suspension.userId, robloxConfig.defaultGroup)
    if (rank !== 0) {
        await groupService.setRank(robloxConfig.defaultGroup, suspension.userId, suspension.rankBack && suspension
            .rank > 0 ? suspension.rank : 1)
    }
    suspension.update({ finished: true }, { hooks: false })
    const username = await userService.getUsername(suspension.userId)
    discordMessageJob('log', `Finished **${username}**'s suspension`)
}
