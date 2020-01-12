'use strict'
const express = require('express')
const router = express.Router()

const userController = require('../controllers/v1/user')

const { handleValidationResult } = require('../middlewares/error')
const { parseParams } = require('../middlewares/request')

router.get('/:username/user-id', userController.validate('getUserId'), handleValidationResult, userController
    .getUserId)

router.get('/:userId/join-date', userController.validate('getJoinDate'), handleValidationResult, parseParams,
    userController.getJoinDate)

module.exports = router