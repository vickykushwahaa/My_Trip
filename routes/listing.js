const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const {storage} = require("../cloudConfig.js")

const multer = require("multer")
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
}

router.get("/search", wrapAsync(listingController.searchListings));


router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

// new Route
router.get("/new", isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.deleteListing))

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.editListing)
);

module.exports = router;