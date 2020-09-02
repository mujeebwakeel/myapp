var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var moment = require("moment");
var Campground = require("./models/campground");
var Contact = require("./models/contact");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var session = require('express-session')
var MemoryStore = require('memorystore')(session);
var User = require("./models/user");
require('dotenv').config();
var chats = 0;



// REQUIRING ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var passwordReset = require("./routes/passwordreset");
var contactRoute = require("./routes/contact");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, 'useUnifiedTopology': true, 'useFindAndModify': false, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: "I want to be the best in all I do",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

setInterval(chat, 600000);

function chat() {
    Contact.find({attention: false}, function(err, foundContacts) {
        if(err || !foundContacts) {
            console.log("Something went wrong");
        } else {
            chats = foundContacts.length;
        }
    })
}

app.use(function(req,res,next){
    res.locals.chat = chats;
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    res.locals.message = req.flash("message");
    res.locals.error = req.flash("error");
    res.locals.logout = req.flash("logout");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use(contactRoute);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(passwordReset);


app.get("*", function(req,res){
    res.send("<h1>The entered URL does not exit on this server.</h1> <h2>Kindly check the URL characters for the correct link.</h2> <h2>Thank you.</h2>");
});

setInterval(checkDates, 432000000);


function checkDates() {
    Campground.find({}, function(err, foundCampgrounds) { 
        foundCampgrounds.forEach(campground => {
            var dates = campground.booking.filter(date => 
                new Date(date) >= new Date("08/22/2020")
            );
            Campground.findOneAndUpdate({name:campground.name}, {booking:dates}, function(err, found) {
                if(err || !found) {
                    console.log("Nothing updated");
                }
            })
        });
    });
}
 
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 