const listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

const Listing = require("../models/listing");

module.exports.searchListings = async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        req.flash("error", "Please enter a search term");
        return res.redirect("/listings");
    }

    // Search by country OR location
    const allListings = await Listing.find({
        $or: [
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", { allListings, searchQuery: query });
};


module.exports.showListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        let oneListing = await listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");

        if (!oneListing) {
            req.flash("error", "Cannot find that Listing!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { oneListing });
    } catch (err) {
        next(err);
    }
}

module.exports.createListing = async (req, res, next) => {
    try {
        // Handle empty image field - remove it so Mongoose can apply default
        if (!req.body.listing.image || req.body.listing.image.trim() === "") {
            delete req.body.listing.image;
        }

        let url = req.file.path;
        let filename = req.file.filename;

        let newListings = new listing(req.body.listing);
        newListings.owner = req.user._id;
        newListings.image = { url, filename };
        
        await newListings.save();
        req.flash("success", "Successfully added a new Listing!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}

module.exports.editListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const oneListing = await listing.findById(id);

        if (!oneListing) {
            req.flash("error", "Cannot find that Listing!");
            return res.redirect("/listings");
        }

        let originalImageUrl = oneListing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

        res.render("listings/edit.ejs", { oneListing, originalImageUrl });
    } catch (err) {
        next(err);
    }
}

module.exports.updateListing = async (req, res, next) => {
    try {
        let { id } = req.params;

        // Handle empty image field
        if (!req.body.listing.image || req.body.listing.image.trim() === "") {
            delete req.body.listing.image;
        }

        let updateData = { ...req.body.listing };

        // If there's a new file, update the image
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            updateData.image = { url, filename };
        }

        // Use { new: true } to get the updated document
        let updatedListing = await listing.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedListing) {
            req.flash("error", "Cannot find that Listing!");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.deleteListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletedListing = await listing.findByIdAndDelete(id);
        
        if (!deletedListing) {
            req.flash("error", "Cannot find that Listing!");
            return res.redirect("/listings");
        }

        req.flash("success", `Listing ${deletedListing.title} has been removed!`);
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}


