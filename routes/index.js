var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//AUTH ROUTES
router.get("/register",function(req,res){
  res.render("register");
});

router.post("/register",function(req,res){
  var newUser=new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      req.flash("error",err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to Yelpcamp "+user.username);
        res.redirect("/campgrounds");
    });
  });
});

router.get("/login",function(req,res){
  res.render("login");
});

router.post("/login",passport.authenticate("local",
{
  successRedirect:"/campgrounds",
  failureredirect:"/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
  req.logout();
  //above logout is a function included in passport module
  req.flash("success","Logged you out!")
  res.redirect("/campgrounds");
})

module.exports=router;
