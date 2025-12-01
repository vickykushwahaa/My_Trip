const listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createReview = async(req, res) => {
    let oneListing = await listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;  

    oneListing.reviews.push(newReview);

    await newReview.save();
    await oneListing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${oneListing._id}`);
};



module.exports.deleteReview = async (req, res) => {
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}