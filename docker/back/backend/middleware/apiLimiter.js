const rateLimiter = require('express-rate-limit')

const apiLimiterGet = rateLimiter({
    windowMs:  3*60 * 1000, // 3 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
	message:{msg:'too many request, try again in 3 mins'},
    
})
const apiLimiterPost = rateLimiter({
    windowMs:  1 * 60 * 1000, // 1 --> 1 minute
	max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minutes)
	message:{msg:'too many request, try again in 1 minute'},
    
})

module.exports = {apiLimiterGet, apiLimiterPost}