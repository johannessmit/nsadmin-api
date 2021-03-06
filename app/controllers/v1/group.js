'use strict'
const { param, body, header, query } = require('express-validator')
const groupService = require('../../services/group')
const { decodeScopeQueryParam, decodeSortQueryParam } = require('../../helpers/request')

exports.validate = method => {
    switch (method) {
        case 'suspend':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                body('userId').exists().isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('reason').exists().isString(),
                body('duration').exists().isInt().toInt(),
                body('rankBack').exists().isBoolean().toBoolean()
            ]
        case 'getShout':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt()
            ]
        case 'getSuspensions':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                query('scope').customSanitizer(decodeScopeQueryParam),
                query('sort').customSanitizer(decodeSortQueryParam)
            ]
        case 'getTrainings':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                query('scope').customSanitizer(decodeScopeQueryParam),
                query('sort').customSanitizer(decodeSortQueryParam)
            ]
        case 'postTraining':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('type').exists().isString(),
                body('date').exists(),
                body('notes').optional().isString()
            ]
        case 'getExiles':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt()
            ]
        case 'getSuspension':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('userId').isInt().toInt(),
                query('scope').customSanitizer(decodeScopeQueryParam)
            ]
        case 'getTraining':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('trainingId').isInt().toInt(),
                query('scope').customSanitizer(decodeScopeQueryParam)
            ]
        case 'shout':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('message').exists().isString()
            ]
        case 'putTraining':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('trainingId').isInt().toInt(),
                body('editorId').exists().isInt().toInt(),
                body('changes.type').optional().isString(),
                body('changes.date').optional().isInt().toInt(),
                body('changes.notes').optional().isString(),
                body('changes.authorId').optional().isInt().toInt()
            ]
        case 'putSuspension':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('userId').isInt().toInt(),
                body('editorId').exists().isInt().toInt(),
                body('changes.authorId').optional().isInt().toInt(),
                body('changes.reason').optional().isString(),
                body('changes.rankBack').optional().isBoolean().toBoolean()
            ]
        case 'getGroup':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt()
            ]
        case 'cancelSuspension':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('userId').isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('reason').exists().isString()
            ]
        case 'cancelTraining':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('trainingId').isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('reason').exists().isString()
            ]
        case 'extendSuspension':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('userId').isInt().toInt(),
                body('authorId').exists().isInt().toInt(),
                body('duration').exists().isInt().toInt(),
                body('reason').exists().isString()
            ]
        case 'putUser':
            return [
                header('authorization').exists().isString(),
                param('groupId').isInt().toInt(),
                param('userId').isInt().toInt(),
                body('rank').exists().isInt().toInt(),
                body('authorId').optional().isInt().toInt()
            ]
    }
}

exports.suspend = async (req, res) => {
    res.json((await groupService.suspend(req.params.groupId, req.body.userId, req.body)).get({ raw: true }))
}

exports.getShout = async (req, res) => {
    res.json(await groupService.getShout(req.params.groupId))
}

exports.getSuspensions = async (req, res) => {
    res.json((await groupService.getSuspensions(req.query.scope, req.query.sort)).map(suspension => suspension.get({
        raw: true })))
}

exports.getTrainings = async (req, res) => {
    res.json((await groupService.getTrainings(req.query.scope, req.query.sort)).map(training => training.get({
        raw: true })))
}

exports.postTraining = async (req, res) => {
    res.json((await groupService.postTraining(req.body)).get({ raw: true }))
}

exports.getExiles = async (req, res) => {
    res.json((await groupService.getExiles()).map(exile => exile.get({ raw: true })))
}

exports.getSuspension = async (req, res) => {
    res.json((await groupService.getSuspension(req.params.userId, req.query.scope)).get({ raw: true }))
}

exports.getTraining = async (req, res) => {
    res.json((await groupService.getTraining(req.params.trainingId, req.query.scope)).get({ raw: true }))
}

exports.shout = async (req, res) => {
    res.json(await groupService.shout(req.params.groupId, req.body.message, req.body.authorId))
}

exports.putTraining = async (req, res) => {
    res.json((await groupService.putTraining(req.params.groupId, req.params.trainingId, req.body)).get({ raw: true }))
}

exports.putSuspension = async (req, res) => {
    res.json((await groupService.putSuspension(req.params.groupId, req.params.userId, req.body)).get({ raw: true }))
}

exports.getGroup = async (req, res) => {
    res.json(await groupService.getGroup(req.params.groupId))
}

exports.cancelSuspension = async (req, res) => {
    res.json((await groupService.cancelSuspension(req.params.groupId, req.params.userId, req.body)).get({ raw: true }))
}

exports.cancelTraining = async (req, res) => {
    res.json((await groupService.cancelTraining(req.params.groupId, req.params.trainingId, req.body)).get({
        raw: true }))
}

exports.extendSuspension = async (req, res) => {
    res.json((await groupService.extendSuspension(req.params.groupId, req.params.userId, req.body)).get({ raw: true }))
}

exports.putUser = async (req, res) => {
    res.json(await groupService.changeRank(req.params.groupId, req.params.userId, req.body))
}
