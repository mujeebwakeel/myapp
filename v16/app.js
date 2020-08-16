var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var moment = require("moment");
var Campground = require("./models/campground");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
require('dotenv').config();



// REQUIRING ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var passwordReset = require("./routes/passwordreset");

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, 'useUnifiedTopology': true, 'useFindAndModify': false, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
    secret: "I want to be the best in all I do",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    res.locals.message = req.flash("message");
    res.locals.error = req.flash("error");
    res.locals.logout = req.flash("logout");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(passwordReset);


app.get("*", function(req,res){
    res.send("<h1>The entered URL does not exit on this server.</h1> <h2>Kindly check the URL characters for the correct link.</h2> <h2>Thank you.</h2>");
});

setInterval(checkDates, 2000000000);


function checkDates() {
    Campground.find({}, function(err, foundCampgrounds) { 
        foundCampgrounds.forEach(campground => {
            var dates = campground.booking.filter(date => 
                new Date(date) >= new Date("08/22/2020")
            );
            Campground.findOneAndUpdate({name:campground.name}, {booking:dates}, function(err, found) {
                if(err || !found) {
                    console.log("Nothing updated");
                } else {
                    console.log(found);
                }
            })
        });
    });
}

 
app.listen(3000, process.env.IP, function(){
    console.log("Server has started");
});