const express = require('express')
const app = express.Router()

const init = connection =>{
  app.get('/',(req, res)=>{
      res.render('home')
  })

  app.get('/new-account',(req, res)=>{
    res.render('new-account', {error:false})
  })

  app.post('/new-account', async (req , res)=>{

    const [rows, fields] = await connection.execute('select * from users where email= ?', [ req.body.email ])

    if(rows.length === 0){
      const {name,email,password} = req.body
       const [inserted, insertFields] = await connection.execute('insert into users(name,email,password,role) values(?,?,?,?)',[
          name,
          email,
          password,
          'user'
       ])
       const user ={
         id: inserted.insertId,
         name: name,
         role: 'user'
       }
       req.session.user = user
       res.redirect('/')
    }else{
      res.render('new-account', {
        error: 'Usuário já existente'
      })
    }/// fim do  if

  })

  app.get('/login',(req , res)=>{
    res.render('login',{error:false})
  })
  app.post('/login',async(req , res)=>{

    const [rows, fields] = await connection.execute('select * from users where email= ?', [ req.body.email ])

    if(rows.length === 0){
      res.render('login',{error: 'Usuário e/ ou senha inválidos'})
    }else{
      if(rows[0].password === req.body.password){
         const userDB = rows[0]
         const user ={
           id: userDB.id,
           name: userDB.name,
           role: userDB.role
         }
         req.session.user = user
         res.redirect('/')
      }else{
        res.render('login' , {error:'Usuário e/ ou senha inválidos'})
      }
    }
  })
  app.get('/logout',(req , res) =>{
      req.session.destroy(err=>{
        res.redirect('/')
      })
  })
  return app
}

module.exports = init
