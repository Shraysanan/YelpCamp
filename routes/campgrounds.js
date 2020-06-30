var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
//by default index.js is required its a special name

router.get("/",function(req,res){
  //we need to first get all campgrounds from db then render it
  Campground.find({},function(err,allCampgrounds){
    if(err){
      console.log(err)
    }
    else{
      res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  })
});
//CREATE ROUTE- add new campground to database
router.post("/",middleware.isLoggenIn,function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var desc=req.body.description;
  var author={
    id:req.user._id,
    username:req.user.username
  }
  var price=req.body.price;
  var newCampground={name:name,price:price,image:image,description:desc,author:author} //we could also paste it inside create without assigning it to a variable but this way is better
  //create a new campground and save to database
  Campground.create(newCampground,function(err,newlyCreated){
    if(err){
      console.log(err)
    }
    else{
      req.flash("success","You created a new Campground!!")
      res.redirect("/campgrounds")
    }
  });
});
//NEW-Show form to create new campground
router.get("/new",middleware.isLoggenIn,function(req,res){
  res.render("campgrounds/new");
});

router.get("/:id",function(req,res){ //this route has to come after /campgrounds/new otherwise new will be considered an id and that route wont be triggered
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){  //findById is a function in mongoose that helps us find stuff by ids,we passed in the id of post and then passed in the comments associated and a callback function
    if(err){
      console.log(err);
    }
    else{
      res.render("campgrounds/show",{campground:foundCampground})
    }
  });
});

//edit route
//we only want to let the owner of campground make changes so we use following logic:
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
      if(err){
        req.flash("error","Campground not found!");
      }
      else{
        res.render("campgrounds/edit",{campground:foundCampground});
      }
  });
});


router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    }
    else{
      req.flash("success","Successfully edited campground")
      res.redirect("/campgrounds/"+req.params.id)
      //we could also use updatedCampground._id above
    }
  });
});

//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campgrounds");
    }
    else{
      req.flash("success","Campground deleted");
      res.redirect("/campgrounds");
    }
  });
});
module.exports=router;
