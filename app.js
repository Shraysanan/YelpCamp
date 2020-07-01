var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    flash=require("connect-flash"),
    Campground=require("./models/campground"),
    Comment=require("./models/comment"),
    seedDB=require("./seeds")
    passport=require("passport"),
    LocalStratergy=require("passport-local"),
    methodOverride=require("method-override"),
    User=require("./models/user");
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    authRoutes=require("./routes/index");
var url=process.env.DATABASEURL||"mongodb://localhost:27017/yelp_camp";
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:false});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
// seedDB();  //seed the database

app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"this is secret content",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
  res.locals.currentUser=req.user;  //will pass current user through every route and will be identified in every template
  res.locals.error=req.flash("error");//we now have flash available on every single template and route
  res.locals.success=req.flash("success");
  //success and error are key names that we gave the flash messages
  next();   //a necessary line as a  middleware has to move forward if this is not included then it stops after executing given task
});
app.get("/",function(req,res){
  res.render("landing")
});

app.use(authRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);
//in above we can pass an additional parameter as the common term in all routes there eg.in campgrounds we can do
app.use("/campgrounds",campgroundRoutes);
//and hence now we can remove the common /campground route from all the routes there
app.use("/campgrounds/:id/comments",commentRoutes);
//now the above route is added prior to all routes in comment routes file

app.listen(process.env.PORT||3000,process.env.IP,function(){
 console.log('yelpcamp has started')
});

//RESTFUL ROUTES
//there are total 7 kinds of restful routes
// name       url         verb    desc
//=============================================================
//INDEX    /dogs          GET     DISPLAY LIST OF ALL dogs
//NEW      /dogs/new      GET     DISPLAY FORM TO MAKE A NEW dog
//CREATE   /dogs          POST    ADD A NEW DOG TO DB
//SHOW     /dogs/:id      GET     SHOW INFO ABOUT ONE DOG
//EDIT     /dogs/:id/edit GET     SHOW EDIT FORM FOR ONE DOG
//UPDATE   /dogs/:id      PUT     UPDATE A PARTICULAR DOG,THEN REDIRECT SOMEWHERE
//DESTROY  /dogs/:id      DELETE  DELETE A PARTICULAR DOG,THEN REDIRECT SOMEWHERE
