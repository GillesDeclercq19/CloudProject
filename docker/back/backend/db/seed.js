const { StatusCodes } = require('http-status-codes')
const Score = require('../models/score')

const fs = require('fs');
const readline = require('readline');

const data = "mockdata.txt"
const delimiter = "-"

const seeden = async () =>{
    const fileStream = fs.createReadStream(data);
    const rl = readline.createInterface({ input: fileStream });
    const newData = [];
for await (const line of rl){
    const [name, score] = line.split(delimiter);
    newData.push({name, score:parseInt(score)});
    }
    await Score.collection.insertMany(newData)
}

module.exports = seeden

const seed = async () => {
    try {
       const totalScores = await Score.countDocuments({});
       if (totalScores > 0){
        console.log("Database is al geseed");
       }else{
        seeden();
       
       }

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ err: error.message });
    }
};


module.exports = seed