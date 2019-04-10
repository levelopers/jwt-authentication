const express = require('express')
const bodyParser = require('body-parser')

let jwt = require('jsonwebtoken')
let config = require('./jwtConfig')
let middleware = require('./middleware')

//mock user info
let mockUsername = 'bob'
let mockPassword = 'Ab123123'

//authorization
class Authorization {
  login(req, res) {
    let { username, password } = req.body
    console.log(`username: ${username} \npassword: ${password}`);
    
    if (username && password) {
      if (username === mockUsername && password === mockPassword) {
        let token = jwt.sign(
          { username: username },
          config.secret,
          { expiresIn: '1d' }
        )
        //return token
        res.json({
          success:true,
          message:"Authentication success",
          token:token
        })
        console.log("signin token:"+"\n"+token);
        
      }else{
        res.status(403).json({
          success:false,
          message:"Incorrect username or password"
        })
      }
    }else{
      res.status(400).json({
        success:false,
        message:"Authentication fail, no username and password supplied"
      })
    }
  }
  index(req,res){
    res.json({
      success:true,
      message:"Index page"
    })
  }
}

let auth = new Authorization()

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/login',auth.login)
app.get('/',middleware.checkToken,auth.index)


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
