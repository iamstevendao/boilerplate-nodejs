var express = require('express')
var path = require('path')
var logger = require('morgan')
var compression = require('compression')
var methodOverride = require('method-override')
var session = require('express-session')
var flash = require('express-flash')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var dotenv = require('dotenv')
var mongodb = require('mongodb').MongoClient

// Load environment variables from .env file
dotenv.load()

// Controllers
var HomeController = require('./controllers/home')
var contactController = require('./controllers/contact')

var app = express()

mongodb.connect(process.env.MONGODB, (err, db) => {
  if (err) { console.log('Unable to connect to the MongoDB server. Error: ', err) }
  console.log('Connection established!')
  db.close()
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(methodOverride('_method'))
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', HomeController.index)
app.get('/contact', contactController.contactGet)
app.post('/contact', contactController.contactPost)

// Production error handler
if (app.get('env') === 'production') {
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.sendStatus(err.status || 500)
  })
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app
