'use strict'
const robloxManager = require('../managers/roblox')

const robloxConfig = require('../../config/roblox')

exports.getUserId = username => {
    const client = robloxManager.getClient()
    return client.getUserId(username)
}

exports.hasBadge = async (userId, badgeId) => {
    const client = robloxManager.getClient(robloxConfig.defaultGroup)
    return (await client.apis.inventory.getUserOwnedItems({
        userId,
        itemType: 'Badge',
        targetId: badgeId
    })).data.length === 1
}

exports.getUsers = async userIds => {
    const client = robloxManager.getClient()
    return (await client.apis.users.getUsersByIds(userIds)).data
}

exports.getRank = async (userId, groupId) => {
    const client = robloxManager.getClient()
    const user = await client.getUser(userId)
    const groups = await user.getGroups()
    const group = groups.find(group => group.id === groupId)
    return group ? group.role.rank : 0
}

exports.getRole = async (userId, groupId) => {
    const client = robloxManager.getClient()
    const user = await client.getUser(userId)
    const groups = await user.getGroups()
    const group = groups.find(group => group.id === groupId)
    return group ? group.role.name : 'Guest'
}

exports.getUsername = userId => {
    const client = robloxManager.getClient()
    return client.getUsername(userId)
}

exports.getUser = userId => {
    const client = robloxManager.getClient()
    return client.apis.users.getUserInfo(userId)
}
