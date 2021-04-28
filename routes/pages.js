const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');


router.get('/', middleware.redirectHome, (req, res)=>{
  res.render('login',{title:'Login Page'});
});

router.get('/profile', middleware.redirectLogin, (req, res)=>{
  res.render('profile',{title:'Profile Page', name:req.session.name});
});


router.get('/register', middleware.redirectHome, (req, res)=>{
  res.render('register',{title:'Register Page'});
});

router.get('/login', middleware.redirectHome, (req, res)=>{
  res.render('login',{title:'Login Page'});
});

module.exports = router;
