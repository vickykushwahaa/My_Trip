
const User = require("../models/user");
module.exports.renderSingup = (req, res) => {
    res.render("users/singup.ejs");
}

module.exports.singup = async(req, res) => {
    try{
    let{username, email, password} = req.body;
    let newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
            req.flash("success", "Welcome to My_Trip");
            res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/singup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login =    async(req,res)=>{
    req.flash("success","welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            nexr(err);
        }
        req.flash("success","You have logged out!");
        res.redirect("/listings");
    })
}