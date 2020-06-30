var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
      if(err){
        req.flash("error","Comment not found!");
        res.redirect("back");
      }
      //does user own the campground
      else{
        //we used equals functionality of mongoose because we are comparing an object and a string but this method can do that,=== wouldnt have helped in this case
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else{
          req.flash("error","PERMISSION DENIED!!");
          res.redirect("back");
        }
      }
    });
  }
  else{
      req.flash("error","you need to be logged in to do that!");
    res.redirect("back");
    //send user to prev page
  }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if(err){
        req.flash("error","Campground not found!");
        res.redirect("back");
      }
      //does user own the campground
      else{
        //we used equals functionality of mongoose because we are comparing an object and a string but this method can do that,=== wouldnt have helped in this case
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }
        else{
          req.flash("error","PERMISSION DENIED!!");
          res.redirect("back");
        }
      }
    });
  }
  else{
    req.flash("error","you need to be logged in to do that!")
    res.redirect("back");
    //send user to prev page
  }
}


middlewareObj.isLoggenIn=function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","You need to be logged in to do that!!!");
  // we flash before redirecting because it displayes on the next task only
  res.redirect("/login");
}





module.exports=middlewareObj;
