module.exports.isLoggedIn = (req,res,next)=>{
  //  console.log(req);
   // console.log(req.path, "...", req.originalUrl);   
      
    if(!req.isAuthenticated()){  
        req.session.redirectUrl = req.originalUrl;      
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
    }
    next();
}

