var express = require("express");
var router = express.Router({mergeParams: true});
var Comment  = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middlewares");

//CREATE COMMENTS ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds/"+req.params.id);
        }else{
           res.render("comments/new", {campground:foundCampground}); 
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.render("comments/new");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err); 
                }else{
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.rating = req.body.rating;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(){
                        req.flash("success", "You successfully created a comment");
                        res.redirect("/campgrounds/"+req.params.id);
                    });
                }
            });
        }
    });
});


// EDIT COMMENT ROUTE
router.get("/:comments_id/edit", middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,campground){
       if(err || !campground){
           req.flash("error", "Campground not found");
           return res.redirect("/campgrounds");
       } 
       Comment.findById(req.params.comments_id, function(err,comment){
        if(err || !comment){
            req.flash("error", "Comment not found");
            res.redirect("/campgrounds");
        }else{
            res.render("comments/edit", {campgroundId:req.params.id, comment:comment});
        }
    });
    });
});


router.put("/:comments_id",  middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success", "You successfully edited a comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DELETE COMMENT ROUTE
router.delete("/:comments_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comments_id, function(err){
        if(err){
        res.redirect("/campgrounds/" + req.params.id);
        }else{
            req.flash("success", "You successfully deleted a comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;