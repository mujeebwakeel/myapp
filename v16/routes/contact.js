var express = require("express");
var router = express.Router();
var Contact = require("../models/contact");
var moment = require("moment");
var middleware = require("../middlewares");


router.get("/contact", function(req,res) {
    res.render("contact/contactUs");
});

router.post("/contact", function(req,res) {
    var contact = req.body.contact;
        contact.date = moment().format("LLL");
    Contact.create(contact, function(err, createdContact) {
        if(err || !createdContact) {
            req.flash("error", "Something went wrong while creating complaint/chat");
            return res.redirect("/contact");
        }
        req.flash("success", "Your chat has been successfully sent");
        res.redirect("/campgrounds");
    });
});

router.put("/contact/:id/edit", middleware.isAdmin, function(req,res) {
    Contact.findById(req.params.id, function(err, foundChat) {
        if(err || !foundChat) {
            req.flash("error", "Chats not found");
            return res.redirect("/campgrounds");
        }
        Contact.findByIdAndUpdate(req.params.id, {attention:true}, function(err, updatedChat) {
            if(err) {
                req.flash("error", "Something went wrong while updating");
                return res.redirect("/ccontact/list");
            }
            req.flash("success", "You successfully edited a chat");
            res.redirect("/contact/list");
        })
    })
})

router.get("/contact/list", middleware.isAdmin, function(req,res) {
    Contact.find({}, function(err, allContacts) {
        if(err || !allContacts) {
            req.flash("error", "Chats not found");
            return res.redirect("/campgrounds");
        }
        res.render("contact/list", {contacts: allContacts, page: "contacts"});

    })
})

router.delete("/contact/:id/delete", middleware.isAdmin, function(req,res) {
    Contact.findById(req.params.id, function(err, toDelete) {
        if(err || !toDelete) {
            req.flash("error", "Chat not found");
            return res.redirect("/contact/list");
        }
        Contact.deleteOne({_id: req.params.id}, function(err, deletedChat) {
            if(err) {
                req.flash("error", "Something went wrong while deleting the chat");
            return res.redirect("/contact/list");
            }
        })
        req.flash("success", "You successfully deleted a chat");
        res.redirect("/contact/list");
    })
})


module.exports = router;