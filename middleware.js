const listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        let redirectUrl = req.originalUrl;

        if (redirectUrl.includes("/reviews")) {
            const listingId = redirectUrl.split("/")[2]; 
            redirectUrl = `/listings/${listingId}`;
        }

        req.session.redirectUrl = redirectUrl;

        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};


module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let Listing = await listing.findById(id);

    if (!Listing.owner.equals(req.user._id)) {
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author) {
        req.flash("error", "This review has no author info.");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

