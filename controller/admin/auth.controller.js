const Account = require("../../model/account.model");

const passwordHelper = require("../../helper/password.helper");
const prefix = require("../../config/system");

// [GET] admin/auth/login
module.exports.login = async (req, res)=>{
    res.render("admin/page/auth/login", {
        titlePage: "Đăng nhập"
    });
}
// [POST] admin/auth/login
module.exports.loginPost = async (req, res)=>{
    const account = await Account.findOne({
        email: req.body.email
    });
    if(!account){
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("referer") || "/")
        return;
    }
    const isPassword = await passwordHelper.comparePassword(
        req.body.password,
        account.password
    );
    if(!isPassword){
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect(req.get("referer") || "/")
        return;
    }
    else{
        res.cookie("token", account.token);
        res.redirect(`${prefix.prefixAdmin}/dashboard`);
    }
}
// [GET] admin/auth/logout
module.exports.logout = async (req, res) =>{
    res.clearCookie("token");
    res.redirect(req.get("referer") || "/");
}