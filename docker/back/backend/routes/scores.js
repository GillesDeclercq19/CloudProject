const express = require('express')
const router = express.Router()
const { getScores, createScore} = require('../controllers/scores')
const filter = require('../middleware/filter')
const {apiLimiterGet, apiLimiterPost} = require('../middleware/apiLimiter')


router.route('/').get(apiLimiterGet, getScores).post(apiLimiterPost, filter, createScore)

module.exports = router