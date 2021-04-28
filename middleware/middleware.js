const redirectLogin = (req, res, next)=>{
    console.log("redirect");
    if(!req.session.name){
      res.redirect('/login');
  
    }
    next();
  }
  const redirectHome = (req, res, next)=>{
    if(req.session.name){
      res.redirect('/profile');
    }
    next();
  }
  module.exports={
      redirectLogin: redirectLogin,
      redirectHome: redirectHome
  };