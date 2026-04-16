module.exports.register = (req, res, next) => {
    if (!req.body.userName) {
        req.flash("error", "Nhập đầy đủ họ tên");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Nhập đầy đủ mật khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.editInfo = (req, res, next) => {
    if (!req.body.userName) {
        req.flash("error", "Nhập đầy đủ họ tên");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.login = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Nhập đầy đủ mật khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.forgot = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Nhập email");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.resetPassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Nhập mật khẩu mới");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Xác nhận mật khẩu mới");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (req.body.confirmPassword != req.body.password) {
        req.flash("error", "Hai mật khẩu khẩu không khớp");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}

module.exports.changePassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Nhập mật khẩu hiện tại");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.newPassword) {
        req.flash("error", "Nhập mật khẩu mới");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Xác nhận khẩu khẩu");
        res.redirect(req.get("referer") || "/");
        return;
    }
    if (req.body.confirmPassword != req.body.newPassword) {
        req.flash("error", "Hai mật khẩu khẩu không khớp");
        res.redirect(req.get("referer") || "/");
        return;
    }
    next();
}