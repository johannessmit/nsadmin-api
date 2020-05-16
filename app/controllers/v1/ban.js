'use strict'
const { param, body, header, oneOf, query } = require('express-validator')
const banService = require('../../services/ban')
const { decodeQuery } = require('../../helpers/request')

exports.validate = method => {
    switch (method) {
        case 'getBans':
            return [
                header('authorization').exists().isString(),
                query('scope').customSanitizer(decodeQuery)
            ]
        case 'ban':
            return [
                header('authorization').exists().isString(),
                body('userId').exists().isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('reason').exists().isString(),
                body('groupId').exists().isInt().toInt()
            ]
        case 'putBan':
            return [
                header('authorization').exists().isString(),
                param('userId').exists().isInt().toInt(),
                body('editorId').exists().isInt().toInt(),
                oneOf([
                    body('changes.authorId').exists().isInt().toInt(),
                    body('changes.reason').exists().isString()
                ])
            ]
        case 'getBan':
            return [
                header('authorization').exists().isString(),
                param('userId').exists().isInt().toInt(),
                query('scope').customSanitizer(decodeQuery)
            ]
        case 'cancelBan':
            return [
                header('authorization').exists().isString(),
                param('userId').exists().isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('reason').exists().isString()
            ]
    }
}

exports.getBans = async (req, res) => {
    res.json((await banService.getBans(req.query.scope)).map(ban => ban.get({ raw: true })))
}

exports.ban = async (req, res) => {
    res.json((await banService.ban(req.body.groupId, req.body.userId, req.body)).get({ raw: true }))
}

exports.putBan = async (req, res) => {
    res.json((await banService.putBan(req.params.userId, req.body)).get({ raw: true }))
}

exports.getBan = async (req, res) => {
    res.json((await banService.getBan(req.params.userId, req.query.scope)).get({ raw: true }))
}

exports.cancelBan = async (req, res) => {
    res.json((await banService.cancelBan(req.params.userId, req.body.authorId, req.body.reason)).get({ raw: true }))
}
