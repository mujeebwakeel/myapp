var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Book = require("../models/booking")
var Comment  = require("../models/comment");
var middleware = require("../middlewares");
var moment = require("moment");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX ROUTE
router.get("/", middleware.paginatedResults(Campground), function(req, res){
    if(req.query.search){
        Campground.find({name: {$regex: req.query.search, $options:"i"}}, function(err, campgrounds){
            if(err || campgrounds.length<1){
                req.flash("error", "No campground was found for the searched term. So sorry for that.");
                res.redirect("/campgrounds")
            }else{
                res.render("campgrounds/index", {campgrounds:campgrounds, results:"undefined", page:"campgrounds"}); 
            }
        })
    } else if(req.query.page){
        res.render("campgrounds/index", {campgrounds:res.paginatedResults.results, results:res.paginatedResults, page:"campgrounds", pageNum:Number(req.query.page)}); 
      } else {
        res.render("campgrounds/index", {campgrounds:res.paginatedResults.firstPage, results:res.paginatedResults, page:"campgrounds", pageNum:1});  
    }
 });
   
// SHOW ROUTE
router.get("/:id", function(req,res){
    Campground.find({}, function(err,allCampgrounds) {
        if(err || !allCampgrounds){
            req.flash("error", "Campgrounds not found");
            return res.redirect("/campgrounds");
        }
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
           req.flash("error", "Campground not found");
           res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/show", {campground: foundCampground, allCampgrounds:allCampgrounds});     
        }
    });
    });
  });

    
// CREATE CAMPGROUND
router.get("/new/campground", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req,res){
   cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
       if(err){
           req.flash("err", err.message);
           return res.redirect("back");
       }
  // add cloudinary url for the image to the campground object under image property
  var campground = req.body.campground;
  campground.image = result.secure_url;
  campground.imageId = result.public_id;
  // add author to campground
  campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  // add created to campground
  campground.created = moment().format("LLL");  
  Campground.create(campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/campgrounds/' + campground._id);
  });
});
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err || !campground){
         res.redirect("/campgrounds");
        }else{
          res.render("campgrounds/edit", {campground:campground});
            }
     }); 
});

router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function(req,res){
         Campground.findById(req.params.id, async function(err,campground) {
             if(err){
                req.flash("error", err.message);
                return res.redirect("back");
              }
                if(req.file){
                   try {
                   await cloudinary.v2.uploader.destroy(campground.imageId);
                   var result = await cloudinary.v2.uploader.upload(req.file.path); 
                   campground.image = result.secure_url;
                   campground.imageId = result.public_id;
                } catch (err) {
                   req.flash("error", err.message)
                   return res.redirect("back");  
                  }
                }
                    campground.name = req.body.name;
                    campground.price = req.body.price;
                    campground.description = req.body.description;
                    campground.save();
                    req.flash("success", "You successfully edited a campground");
                    return res.redirect("/campgrounds/"+campground._id);           
                });
            });
  
                
// DELETE CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            return res.redirect("back");
        }
            try {
               await cloudinary.v2.uploader.destroy(campground.imageId);
               Campground.deleteOne(campground, function(){
                   req.flash("success", "You successfully deleted a campground");
                   res.redirect("/campgrounds");   
                });
            } catch (err) {
                req.flash("error", err.message);
                return res.redirect("/campgrounds");
            }
        });
    });

    router.get("/:id/booking", function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err || !foundCampground) {
                req.flash("error", "Something went wrong");
                return res.redirect("/campgrounds/"+req.params.id);
            }
            res.render("campgrounds/booking", {campground: foundCampground, selectedDate: foundCampground.booking}); 
        });
    });

    router.post("/:id/booking", function(req,res) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err || !foundCampground) {
                req.flash("error", "Something went wrong");
                return res.redirect("/campgrounds/"+req.params.id);
            }
            for (var d = new Date(req.body.from);
						d <= new Date(req.body.to);
						d.setDate(d.getDate() + 1)) {
							foundCampground.booking.push(moment(d).format("L"));
                    }
                // saving the campground
                foundCampground.save(function(err, savedCampground) {
                    if(err || !savedCampground) {
                        req.flash("error", "Something went wrong while saving dates into campground");
                        return res.redirect("/campgrounds/"+req.params.id);
                    }
                    const booking = new Book({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        familyMembers: req.body.familyMembers,
                        email: req.body.email,
                        from: req.body.from,
                        to: req.body.to,
                        campName: foundCampground.name
                    });
                    booking.save(function(err, savedBooking) {
                        if(err || !savedBooking) {
                            req.flash("error", "Something went wrong");
                            return res.redirect("/campgrounds/"+req.params.id);
                        }
                        res.render("campgrounds/transaction", {bookingInfo: savedBooking});
                    })
                })
        });
    })

    // router.get("/camp/eleko", function(req,res) {
    //     Campground.deleteOne({name:"Eleko"}, function(err, foundCampground){
    //         if(err){
    //            req.flash("error", "Campground could not be deleted");
    //            res.redirect("/campgrounds");
    //         }else{
    //             res.send("Campground successfully deleted");     
    //         }
    //     });
    // });


    router.get("/allcamps/here", function(req,res) {
        Book.find({}, function(err, bookings){
            if(err || !bookings){
               req.flash("error", "Campground not found");
               res.redirect("/campgrounds");
            }else{
                res.send(bookings);     
            }
        });
    });


module.exports = router;