const User = require("../../model/user.model");
const Cart = require("../../model/cart.model");
const ForgotPassword = require("../../model/forgot-password.model");

const passwordHelper = require("../../helper/password.helper");

// [GET] /user/register
module.exports.register = async (req, res)=>{
    res.render("client/page/auth/register", {
        titlePage: "Đăng ký"
    });
}
// [POST] /user/register
module.exports.registerPost = async (req, res)=>{
    const existEmail = await User.findOne({
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if(existEmail){
        req.flash("error", "Email đã tồn tại! Vui lòng nhập emai khác");
        res.redirect("/auth/register");
        return;
    }else{
        req.body.password = await passwordHelper.hashPassword(req.body.password);
        const user = new User(req.body);
        await user.save();
        const cart = await Cart.updateOne({
            _id: req.cookies.cartID
        }, {
            $set: {
                user_id: user._id
            }
        });
        res.cookie("tokenUser", user.tokenUser);
    }
    
    res.redirect("/");
}
// [GET] /user/login
module.exports.login = async (req, res)=>{
    res.render("client/page/auth/login", {
        titlePage: "Đăng nhập"
    });
}
// [POST] /user/login
module.exports.loginPost = async (req, res)=>{
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if(!existEmail){
        req.flash("error", "Email không tồn tại!");
        res.redirect("/auth/login");
        return;
    }else{
        const isPassword = await passwordHelper.comparePassword(
            req.body.password,
            existEmail.password
        );
        if(!isPassword){
            req.flash("error", "Password không đúng!");
            res.redirect("/auth/login");
            return
        }
        if(existEmail.status != "active"){
            req.flash("error", "Tài khoản đã bị khóa!");
            res.redirect("/auth/login");
            return;
        }
    }
    res.cookie("tokenUser", existEmail.tokenUser);
    const cart = await Cart.findOne({
        user_id: existEmail._id
    });
    res.cookie("cartID", cart._id);
    res.redirect("/");
}
// [GET] /user/logout
module.exports.logout = async (req, res)=>{
    res.clearCookie("tokenUser");
    res.clearCookie("cartID");
    res.redirect("/");

}
// [GET] /user/forgot-password
module.exports.forgot = async (req, res)=>{
    res.render("client/page/auth/forgot-password", {
        titlePage: "Quên mật khẩu"
    });
}
// [POST] /user/forgot-password
module.exports.forgotPost = async (req, res)=>{
    console.log(req.body);
    const user = await User.findOne({
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if(!user){
        req.flash("error", "Email không tồn tại hoặc tài khoản đã bị khóa");
        return res.redirect(req.get("referer") || "/");
    }
    
    res.send("OK");
}