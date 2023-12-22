const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const mongoose = require('mongoose');
const {Users, Exercise} = require('./model');

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Database Connected!'));

app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req,res) => {
  const {username} = req.body
  const newUser = new Users({username:username})
  newUser.save().then(saved => {
    res.json(saved)
  }).catch(err => console.log(err))
})

app.post('/api/users/:_id/exercises', async (req,res) => {
  try {
    const id = req.params._id
    const {description, duration, date} = req.body
    const user = await Users.findById(id)
    if(!user){
      res.send('Could not find user')
    } else{
      const exerciseObj = new Exercise({
        user_id: user._id,
        description, 
        duration,
        date: date ? new Date(date)  : new Date()
      })
      const saved = await exerciseObj.save()
      res.json({
        _id: user._id,
        username: user.username,
        description: saved.description,
        duration: saved.duration,
        date: new Date(saved.date).toDateString()
      })
    }
  } catch (error) {
    console.log(error);
  }
})

app.get('/api/users', async(req,res) => {
  const users = await Users.find().select('-__v')
  // Users.find().then(data => {
  //   console.log(data);
    res.json(users)
  // }).catch(err => console.log(err))
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
