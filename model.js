const mongoose = require('mongoose')

const Users = mongoose.model('Users',{
  username: {
    type: String
  }
})

const Exercise = mongoose.model('Exercises', {
  user_id: {
    type: String, required: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number
  },
  date: {
    type: Date
  }
})

module.exports = {Users, Exercise}