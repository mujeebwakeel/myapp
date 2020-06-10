var Campground = require("../models/campground");
var Comment  = require("../models/comment");
var User = require("../models/user");

var middleware = {};

middleware.checkCampgroundOwnership = function(req,res,next){
                if(req.isAuthenticated()){
                    Campground.findById(req.params.id, function(err,campground){
                    if(err || !campground){
                     req.flash("error", "Campground not found");
                     res.redirect("/campgrounds");
                    }else{
                        if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
                          next();
                        }else{
                            req.flash("message", "You do not have permission to do that");
                            res.redirect("/campgrounds");
                        }
                     }
                 }); 
                } else {
                    req.flash("message", "Sorry, you need to log in first in order to do that");
                    res.redirect("/login");
                }
            
            }
 
middleware.checkCommentOwnership = function(req,res,next){
                if(req.isAuthenticated()){
                    Comment.findById(req.params.comments_id, function(err, comment){
                       if(err || !comment){
                           req.flash("error", "Comment not found");
                           res.redirect("/campgrounds");
  
                       }else{
                           if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                               next();
                           }else{
                               req.flash("message", "You do not have permission to do that");
                               res.redirect("/campgrounds");
                           }
                       }
                    });
            }else{
                req.flash("message", "Sorry, you need to log in first in order to do that");
                res.redirect("/login");
            }
            }
            
middleware.isLoggedIn = function(req,res,next){
                if(req.isAuthenticated()){
                    return next();
                }
                req.flash("message", "Please login first"); 
                res.redirect("/login");
            }

middleware.checkEmailRepetition = function (req, res, next) {
    User.findOne({email: req.body.email}, function(err, foundUser){
        if(err || foundUser) {
            req.flash("error", "Try using another email address");
            return res.redirect("/register");
        }
            next();
    });
}


middleware.paginatedResults = function (model) {
    return async (req,res,next) =>{
        const limit = 5
        const results = {}
        var number = await model.estimatedDocumentCount().exec();
            results.maxPageNum = Math.ceil(number/limit);
       
        if(req.query.page){
            const page = parseInt(req.query.page)
            const startIndex = (page-1) * limit
            const endIndex = page * limit
                
                if(endIndex < await model.estimatedDocumentCount().exec()) {
                results.next = {
                    page: page+1,
                }
            }
            
                if(startIndex > 0) {
                results.previous = {
                    page: page-1
                }
            }
           
            try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            } catch (e) {
            res.status(500).json({message : e.message});
          }
        }
        
        try {
            results.firstPage = await model.find().limit(limit).skip(0).exec();
            res.paginatedResults = results;
            next();
        } catch(e) {
            res.status(500).json({message : e.message});
        }
     }
}













module.exports = middleware;