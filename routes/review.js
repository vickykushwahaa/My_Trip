const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
}

//Post Review route
router.post("/",validateReview, isLoggedIn, wrapAsync(reviewController.createReview))

//Detele Review route
// router.delete("/:reviewId", wrapAsync(review.deleteReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;