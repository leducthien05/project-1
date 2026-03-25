const Account = require("../../model/account.model");

const prefixAdmin = require("../../config/system");
const passwordHelper = require("../../helper/password.helper");

module.exports.index = async (req, res)=>{
    res.render("admin/page/my-account/index", {
        titlePage: "Thông tin tài khoản"
    });
}

module.exports.edit = async (req, res)=>{
    res.render("admin/page/my-account/edit", {
        titlePage: "Chỉnh sửa thông tin"
    });
}

module.exports.editPatch = async (req, res)=>{
    const id = res.locals.accountAdmin._id;

    const existEmail = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });
    if(existEmail){
        req.flash("error", "Email đã tồn tại! Vui lòng nhập email khác");
        res.redirect(res.get("referer") || "/");
    }else{
        if(req.body.password){
            req.body.password = await passwordHelper.hashPassword(req.body.password);
        }else{
            delete req.body.password;
        }
        await Account.updateOne({
            _id: id
        }, req.body);
        req.flash("success", "Cập nhật thông tin thành công");
        res.redirect(req.get("referer") || "/");
    }
    
}