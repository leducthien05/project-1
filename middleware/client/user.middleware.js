const User = require("../../model/user.model");
const Cart = require("../../model/cart.model");

module.exports.user = async (req, res, next)=>{
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            status: "active",
            deleted: false
        }).select("-password");
        if(user){
            res.locals.user = user
        }
    }
    next();
}