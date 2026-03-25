const Account = require("../../model/account.model");
const Role = require("../../model/role.model");
const prefix = require("../../config/system");

module.exports.authLogin = async (req, res, next)=>{
    if(req.cookies.token){
        const account = await Account.findOne({
            token: req.cookies.token
        }).select("-password");
        if(!account){
            req.flash("warning", "Tài khoản đã bị khóa`");
            return res.redirect(`${prefix.prefixAdmin}/auth/login`);
        }else{
            const role = await Role.findOne({
                _id: account.role_id
            }).select("name permission");
            res.locals.accountAdmin = account;
            res.locals.roleAccount = role;
            next();
        }
    }else{
        res.redirect(`${prefix.prefixAdmin}/auth/login`);
    }
}