const mysql = require('my-sql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORTT
});

exports.login = async(req, res)=>{
 
    const {name, username, password} = req.body;
    if(!username || !password){
      return res.status(400).render('login',{message:'Please provide an email and password'});
    }

    connection.query('SELECT * FROM auth_lab WHERE username =?', [username],async(error,results)=>{
      if (error){
        console.log(error);
        res.redirect('/login');
      }
      else if(!results || !(await bcrypt.compare(password, results[0].password)) || !username){
        res.status(401).render('login',{message: 'Username or password is invalid'});
      }else{
        req.session.name = results[0].name;
        req.session.id = results[0].id;
        const id = results[0].id;
        const token = jwt.sign({id: id}, process.env.JWT_SECRET,{
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions ={
          expires: new Date(
            Date.now + process.env.JWT_EXPIRES_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly:true
        }
        res.cookie('cookie',token, cookieOptions);
        res.redirect('/profile');
        res.end();

      }
    });

  }


exports.register = (req,res) =>{

  const{ name, username, password, passwordConfirm } = req.body;

  connection.query('SELECT username FROM auth_lab WHERE username = ?', [username], async(error,result)=>{
    if(error){
      console.log(error);
    }
    if(name.length == 0){
      return res.render('register',{message: "Name can't be blank"});
    }
    if(username.length >= 20){
      return res.render('register',{message: "The username is too long, need <= 20"});
    }
    if(password.length == 0){
      return res.render('register',{message: "Password can't be blank"});
    }
    else{
          if(result.length > 0){
            return res.render('register',{message: "That email is already in use"});
          }
          if(password !== passwordConfirm){
            return res.render('register',{message: "Password do not match"});
          }
      }



    let hashedPassword = await bcrypt.hash(password, 8);

    connection.query('INSERT INTO auth_lab SET ?',
      {name: name, username: username, password: hashedPassword},
      (error, result)=>{
        if(error){
          console.log(error);
          res.render('register',{message: "Register error"});
          res.redirect('/register');
        }
          res.redirect('/login');
          res.end();
        
      })


  });
};
exports.logout = (req,res) =>{
  console.log("export logout");
  req.session.destroy(err =>{
    if(err){
      return res.redirect('/profile');

    }

  //  res.clearCookie(req.session.name);
    res.redirect('/login');
    res.end();
  });

}
