'use strict'
const express = require('express')
const router = express.Router()

const userController = require('../controllers/v1/user')

const { handleValidationResult } = require('../middlewares/error')
const { parseParams } = require('../middlewares/request')
const { authenticate } = require('../middlewares/auth')

router.get('/:username/user-id', userController.validate('getUserId'), handleValidationResult, authenticate,
    userController.getUserId)

router.get('/:userId/join-date', userController.validate('getJoinDate'), handleValidationResult, authenticate,
    parseParams, userController.getJoinDate)

router.get('/:userId/has-badge/:badgeId', userController.validate('hasBadge'), handleValidationResult,
    parseParams, authenticate, userController.hasBadge)

router.post('/', userController.validate('getUsers'), handleValidationResult, authenticate, userController
    .getUsers)

router.get('/:userId/rank/:groupId', userController.validate('getRank'), handleValidationResult, authenticate,
    parseParams, userController.getRank)

router.get('/:userId/role/:groupId', userController.validate('getRole'), handleValidationResult, authenticate,
    parseParams, userController.getRole)

router.get('/:userId', userController.validate('getUser'), handleValidationResult, parseParams, authenticate,
    userController.getUser)

module.exports = router
