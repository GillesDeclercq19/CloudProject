const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a valid name'],
    maxlength: 30,
    minlength: 3,
  },
  score: {
    type: Number,
    required: [true, 'Score not provided'],
  },
})

module.exports = mongoose.model('Score', scoreSchema)