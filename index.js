const express = require('express');
const mysql = require('my-sql');
const session = require('express-session');
const dotenv = require('dotenv');
const expbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-Override');
const port = process.env.PORT || 3000;

dotenv.config({path: './.env'});

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORTT
});

const app = express();
app.engine('handlebars',expbs({
  defaultLayout:'main',
  layoutDir: path.join(__dirname,'views/main')
}));
app.set('view engine','handlebars');

app.use(express.static('public'));
//Parse URL-encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended:false}));
//Parse JSON bodies as sent by API clients
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

connection.connect(function(err){
  if(err){
    console.log("connection error: " + err);
  } else{
    console.log("connection successful!");
  }
});

app.use(session(
  {secret:process.env.SESSION_SECRET,
    resave: "true",
    saveUninitialized: "false"}));

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));



app.listen(port, function(){
  console.log("Listening on localhost:" + port);
});
