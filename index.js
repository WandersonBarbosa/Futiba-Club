const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const account = require('./account.js')
const groups = require('./groups')
const admin = require('./admin')
const classification = require('./classification')

app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({
  secret:'fullstack-academy',
  resave: true,
  saveUninitialized: true,
}))
const init = async()=>{
  const connection = await mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password:'',
    database:'futibaclub'
  })
  app.use((req, res, next )=>{
    if(req.session.user){
      res.locals.user = req.session.user
    }else{
      res.locals.user = false
    }
    next()
  })
  app.use(account(connection))
  app.use('/admin', admin(connection))
  app.use('/groups', groups(connection))
  app.use('/classification', classification(connection))
  
  app.listen(3000, err=>{
    console.log('Futiba Club is running ...... ')
  })
}
init()
