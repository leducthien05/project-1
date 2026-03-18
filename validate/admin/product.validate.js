module.exports.create = (req, res, next)=>{
    if(!req.body.name){
        req.flash("error", "Vui lòng nhập đầy tên sản phẩm!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if(!req.body.price){
        req.flash("error", "Vui lòng nhập đầy tên sản phẩm!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.createCategory = (req, res, next)=>{
    if(!req.body.name){
        req.flash("error", "Vui lòng nhập đầy tên danh mục!");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}