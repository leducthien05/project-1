module.exports.register = (req, res, next)=>{
    if(!req.body.userName){
        req.flash("error", "Nhập đầy đủ họ tên");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.email){
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.password){
        req.flash("error", "Nhập đầy đủ mật khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.login = (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.password){
        req.flash("error", "Nhập đầy đủ mật khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.forgot = (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}
module.exports.forgot = (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}