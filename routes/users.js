var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

const passport = require('passport');
const { forwardAuth } = require('../config/auth');

var User = require('../models/UserSchema')

/* GET Login */
router.get('/login', forwardAuth, function(req, res, next) {
  res.render('login', { title: "Halaman Login" });
});

/* Get Register */
router.get('/register', forwardAuth, (req, res, next) => {
  res.render('register', { title: "Halaman Register" });
});

/* Post Login */
router.post('/login', forwardAuth, (req, res, next) => {
  const { email, password} = req.body;
  console.log(req.body);

  let errors = [];

  if (!email || !password) {
    errors.push({msg:"Silahkan Lengkapi Data Anda"});
  }

  if (errors.length > 0) {
    res.render("login",{
      errors,
      email,
      password
    });
  } else {
    
    passport.authenticate('local', {  successRedirect: '/dashboard',
                                      failureRedirect: '/auth/login',
                                      failureFlash: true 
                                  })(req, res, next)

  }
  
})

/* Post Register */
router.post('/register', forwardAuth, (req,res) => {
  const {name,email,password,password2} = req.body;
  console.log(req.body);

  let errors = [];
  
  if (!name || !email || !password || !password2) {
    errors.push({msg:"Silahkan Lengkapi Data Anda"});
    console.log("Silahkan Lengkapi Data Anda");
  }
  
  if (password != password2) {
    errors.push({msg:"Password anda tidak sama"});
    console.log("Password anda tidak sama");
  }

  if(errors.length > 0){
    res.render("register",{
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({email:email}).then(
      user => {
        if (user) {
          errors.push({msg:'Email Sudah Ada'});
          console.log('Email Sudah Ada');
          res.render("register",{
            errors,
            name,
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password:req.body.password
          });
          newUser.save().then(user =>{
            console.log("Selamat Anda Berhasil Registrasi, Silahkan Login");
            res.redirect("/auth/login");
          }).catch(err => console.log(err));
        }
      }
    );
  }
  
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
