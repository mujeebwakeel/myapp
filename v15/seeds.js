 var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Kelvin Laneseli",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc cursus et leo ac consectetur. Aliquam et elit et nunc aliquet venenatis. Donec condimentum hendrerit ex, quis bibendum dui fermentum sed. Fusce turpis enim, varius quis egestas quis, semper nec arcu. Nullam a metus vel dolor rhoncus pretium ut et metus. Vestibulum in mauris auctor, tempor eros sit amet, cursus massa. Cras erat orci, mattis ut felis eget, suscipit ornare purus. Aliquam ac scelerisque tortor. Proin porttitor imperdiet nulla quis eleifend. Aliquam tincidunt, mauris a sodales dapibus, leo dui pretium ante, ut facilisis lectus tortor eu mauris. Aenean feugiat eros et viverra bibendum. Nulla lacinia sagittis velit. Suspendisse eget quam eu nisl hendrerit commodo ut vitae nisi. Nunc nec arcu orci. Vivamus quis ex ac massa rhoncus lacinia cursus vel erat."
    },
    {
        name: "Cameron Vaugnan",
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc cursus et leo ac consectetur. Aliquam et elit et nunc aliquet venenatis. Donec condimentum hendrerit ex, quis bibendum dui fermentum sed. Fusce turpis enim, varius quis egestas quis, semper nec arcu. Nullam a metus vel dolor rhoncus pretium ut et metus. Vestibulum in mauris auctor, tempor eros sit amet, cursus massa. Cras erat orci, mattis ut felis eget, suscipit ornare purus. Aliquam ac scelerisque tortor. Proin porttitor imperdiet nulla quis eleifend. Aliquam tincidunt, mauris a sodales dapibus, leo dui pretium ante, ut facilisis lectus tortor eu mauris. Aenean feugiat eros et viverra bibendum. Nulla lacinia sagittis velit. Suspendisse eget quam eu nisl hendrerit commodo ut vitae nisi. Nunc nec arcu orci. Vivamus quis ex ac massa rhoncus lacinia cursus vel erat."
    },
    {
        name: "Jimmy Conover",
        image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc cursus et leo ac consectetur. Aliquam et elit et nunc aliquet venenatis. Donec condimentum hendrerit ex, quis bibendum dui fermentum sed. Fusce turpis enim, varius quis egestas quis, semper nec arcu. Nullam a metus vel dolor rhoncus pretium ut et metus. Vestibulum in mauris auctor, tempor eros sit amet, cursus massa. Cras erat orci, mattis ut felis eget, suscipit ornare purus. Aliquam ac scelerisque tortor. Proin porttitor imperdiet nulla quis eleifend. Aliquam tincidunt, mauris a sodales dapibus, leo dui pretium ante, ut facilisis lectus tortor eu mauris. Aenean feugiat eros et viverra bibendum. Nulla lacinia sagittis velit. Suspendisse eget quam eu nisl hendrerit commodo ut vitae nisi. Nunc nec arcu orci. Vivamus quis ex ac massa rhoncus lacinia cursus vel erat."
    }
    ];

function seedDB(){
      Campground.deleteMany({}, function(err){
        // if(err){
        //     console.log(err);
        // }else{
        //   console.log("removed campgrounds");
        // }
        // data.forEach(function(campground){
        //     Campground.create(campground, function(err, campground){
        //         if(err){
        //             console.log("There is an error creating campground");
        //         }else{
        //             console.log("Campground successfully created"); 
        //             Comment.create({
        //                 text: "This place is a nice place to be, but I wish there was internet",
        //                 author: "Adeyinka"
        //             }, function(err, comment){
        //                 if(err){
        //                     console.log("Error creating a comment");
        //                 }else{
        //                   campground.comments.push(comment);
        //                   campground.save(); 
        //                   console.log("comment successfully created");
        //                 }
        //             });
                    
        //         }
        //     });
        // });
    });   
}

module.exports = seedDB;

