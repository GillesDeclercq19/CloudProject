const invalidBody = require('../errors/invalidBody')
const nameError = require('../errors/nameError')
const Filter = require('bad-words');
aa = new Filter();

const filter = async (req, res, next) => {
    const {name, score} = req.body
    if (!name || !score){
        throw new invalidBody('Missing fields')
    }
    const filterdName = aa.clean(name)
    if (filterdName.includes('*')) {
        throw new nameError('inappropriate name')
    }
    next();
}

module.exports = filter;