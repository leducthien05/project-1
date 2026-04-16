const User = require("../../model/user.model");
const Cart = require("../../model/cart.model");
const ForgotPassword = require("../../model/forgot-password.model");

const passwordHelper = require("../../helper/password.helper");
const sendMailer = require("../../helper/sendMail.helper");
const generalHelper = require("../../helper/general.helper");

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/page/user/register", {
        titlePage: "Đăng ký"
    });
}
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại! Vui lòng nhập emai khác");
        res.redirect("/user/register");
        return;
    } else {
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
module.exports.login = async (req, res) => {
    res.render("client/page/user/login", {
        titlePage: "Đăng nhập"
    });
}
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if (!existEmail) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("/user/login");
        return;
    } else {
        const isPassword = await passwordHelper.comparePassword(
            req.body.password,
            existEmail.password
        );
        if (!isPassword) {
            req.flash("error", "Password không đúng!");
            res.redirect("/user/login");
            return
        }
        if (existEmail.status != "active") {
            req.flash("error", "Tài khoản đã bị khóa!");
            res.redirect("/user/login");
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
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartID");
    res.redirect("/");

}
// [GET] /user/forgot-password
module.exports.forgot = async (req, res) => {
    res.render("client/page/user/forgot-password", {
        titlePage: "Quên mật khẩu"
    });
}
// [POST] /user/forgot-password
module.exports.forgotPost = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        status: "active",
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại hoặc tài khoản đã bị khóa");
        return res.redirect(req.get("referer") || "/");
    }
    const otp = generalHelper.generateRandomNumber(6);
    const objectForgotPass = {
        email: email,
        otp: otp,
        expireAt: new Date()
    };
    const record = new ForgotPassword(objectForgotPass);
    await record.save();
    //Gửi OTP qua email
    const toEmail = email;
    const subject = "Mã OTP xác nhận";
    const html = `
            Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Sẽ hết hạn sau 3 phút
        `;
    sendMailer.sendMailer(toEmail, subject, html);
    res.redirect(`/user/forgot-password/otp?email=${email}`);
}
// [GET] /user/forgot-password/otp
module.exports.getOtp = async (req, res) => {
    const email = req.query.email; 
    res.render("client/page/user/getOtp", {
        titlePage: "Nhập OTP",
        email: email
    });
}
// [POST] /user/forgot-password/otp
module.exports.getOtpPost = async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;
    console.log(otp, email)
    const record = await ForgotPassword.findOne({
        otp: otp,
        email: email
    });
    if(!record){
        req.flash("error", "Mã OTP không đúng hoặc đã hết hạn");
        return res.redirect(req.get("referer") || "/");
    }
    res.render("client/page/user/reset-password", {
        titlePage: "Đặt lại mật khẩu",
        email: email
    });
}
// [GET] /user/reset-password
module.exports.resetPassword = async (req, res) => {
    const email = req.body.email;
    res.render("client/page/user/reset-password", {
        titlePage: "Đặt lại mật khẩu",
        email: email
    });
}
// [POST] /user/reset-password
module.exports.resetPasswordPost = async (req, res) => {
    const email = req.body.email;
    const password = await passwordHelper.hashPassword(req.body.password);
    try {
        await User.updateOne({
            email: email
        }, {
            $set: {
                password: password
            }
        });
        const user = await User.findOne({
            email: email
        });
        res.cookie("tokenUser", user.tokenUser);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/");
}
// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("client/page/user/info", {
        titlePage: "Thông tin người dùng"
    });
}
// [GET] /user/info
module.exports.edit = async (req, res) => {
    res.render("client/page/user/edit", {
        titlePage: "Thông tin người dùng"
    });
}
// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user._id;
    const existUser = await User.findOne({
        _id: {$ne: id},
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if(existUser){
        req.flash("error", "Email đã tồn tại");
        res.redirect(req.get("referer") || "/");
        return;
    }
    await User.updateOne({
        _id: id
    }, req.body);
    res.redirect("/user/info");
}
// [GET] /user/change-password
module.exports.changePassword = async (req, res) => {
    res.render("client/page/user/change-password", {
        titlePage: "Thay đổi mật khẩu"
    });
}
// [POST] /user/change-password
module.exports.changePasswordPost = async (req, res) => {
    try {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        });
        const equalPassword = await passwordHelper.comparePassword(req.body.password, user.password)
        if(equalPassword != true){
            req.flash("error", "Mật khẩu hiện tại không đúng");
            res.redirect(req.get("referer") || "/");
            return;
        }
        const password = await passwordHelper.hashPassword(req.body.newPassword);
        await User.updateOne({
            _id: user._id
        }, {
            $set: {
                password: password
            }
        });
    } catch (error) {
        console.log(error);
    }
    res.redirect("/user/info");
}