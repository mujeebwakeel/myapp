var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Campground = require("../models/campground");
var middleware = require("../middlewares");


// ROUTE ROUTEE
router.get("/", function(req, res){
    res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req,res){
    if(req.user) {
        req.flash("message", "You are currently logged in");
        return res.redirect("/campgrounds");
    }
    res.render("register", {page: 'register'});
});

router.post("/register", middleware.checkEmailRepetition, function(req,res){
             var newUser = new User({username: req.body.username,
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    avatar: req.body.avatar,
                                    email: req.body.email,
                                    description: req.body.description
                                });
    if(req.body.adminCode === process.env.ADMINCODE){
        newUser.isAdmin = true;
    }
   User.register(newUser, req.body.password, function(err,user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success", "You are now signed in as " + req.user.username + ". Welcome to WhykayCamp Website.");
           res.redirect("/campgrounds");
       });
     }); 
    });



// LOGIN ROUTES
router.get("/login", function(req,res){
    if(req.user) {
        req.flash("message", "You are currently logged in");
        return res.redirect("/campgrounds");
    }
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
    successFlash: "You are now logged in!",
    successRedirect: "/campgrounds",
    failureFlash: true,
    failureRedirect: "/login"
}), function(req,res){
});

// LOG OUT ROUTE
router.get("/logout", function(req,res){
    req.logout();
    req.flash("logout", "You are now logged out!");
    res.redirect("/campgrounds");
});

router.get("/users/:userid", function(req,res){
    User.findById(req.params.userid, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "There was a problem retrieving the user data");
            res.redirect("/campgrounds");
        }else{
            Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
                if(err){
            req.flash("error", "There was a problem retrieving the user data");
            res.redirect("/campgrounds");
        }else{
            res.render("users/show", {user: foundUser, campgrounds: campgrounds, profile:"profile"});
        }
            });
        }
    });
});



module.exports = router;
