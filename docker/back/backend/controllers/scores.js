const { StatusCodes } = require('http-status-codes')
const invalidBody = require('../errors/invalidBody')
const Score = require('../models/score')

const getScores = async (req, res) => {
    try {
        const scores = await Score.find().sort('score');
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalScores = await Score.countDocuments({});
        const numOfPages = Math.ceil(totalScores / limit);

        res.status(StatusCodes.OK).json({ scores: scores.slice(skip, skip + limit), totalScores, numOfPages });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ err: error.message });
    }
};

const createScore =async (req,res) =>{
    const {name, score} = req.body
    if (!name || !score){
        throw new invalidBody('Missing fields')
    }
    try {
        const score = await Score.create(req.body)
        res.status(StatusCodes.CREATED).json({ score })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ err:error.message })
    }
    
}

module.exports = {
    getScores, createScore
  }