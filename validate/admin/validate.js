module.exports.createAccount = (req, res, next)=>{
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập đầy tên tài khoản!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập\ email!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}
module.exports.editAccount = (req, res, next)=>{
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập đầy tên tài khoản!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}
module.exports.login = async (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

