const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/todo')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static('public'))

const readFromDB = require('./readDb.js')
const writeToDB = require('./writeDb.js')
const UpdateDB = require('./updateDb.js')
const deleteFromDB = require('./deleteDb')

app.get('/', function (req, res) {
  res.render('pages/index')
})
app.get('/read', function (req, res) {
  readFromDB(sequelize, res)
})

app.post('/write/:content', function (req, res) {
  const contentToWrite = req.params.content
  writeToDB(sequelize, res, contentToWrite)
})

app.put('/update/:id/', function (req, res) {
  const description = req.body.description
  const status = req.body.status
  const id = req.params.id
  UpdateDB(sequelize, res, description, status, id)
})

app.delete('/delete/:id', function (req, res) {
  const id = req.params.id
  deleteFromDB(sequelize, res, id)
})

app.listen(3007)
