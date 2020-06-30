var express=require("express");
var router=express.Router({mergeParams:true});
//merge params will merge params from campgrounds and comments together and fixes the issue where id wasnt being found
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//comments ROUTES
//we are going to be making comment routes as nested routes as they will be inherently dependent on the campground and the id
router.get("/new",middleware.isLoggenIn, function(req,res){
  //find campground by id and pass it to template for use
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {campground:campground});
    }
  });
});

router.post("/",middleware.isLoggenIn, function(req,res){
  //lookup campground using id
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
      req.flash("error","Campground can't be found!")
      res.redirect("/campgrounds");
    }
    else{
    Comment.create(req.body.comment,function(err,comment){
      if(err){
        req.flash("error","something went wrong :(")
        console.log(err);
      }
      else{
        //add username and id to comment
        comment.author.id=req.user._id;
        comment.author.username=req.user.username;
        //save comment
        comment.save();
        campground.comments.push(comment);
        campground.save();
        req.flash("success","Successfully added comment");
        res.redirect("/campgrounds/"+campground._id);
      }
    });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect to show page
});

//comments edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err){
      res.redirect("back");
    }
    else{
      res.render("comments/edit",{campground_id:req.params.id , comment:foundComment});
    }
  })
});
//commemts update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    }
    else{
      req.flash("success","Your comment has been edited");
      res.redirect("/campgrounds/"+req.params.id);
    }
  })
})
//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
         req.flash("error","something went wrong");
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});
module.exports=router;
