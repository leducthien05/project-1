const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/user.controller");
const authValidate = require("../../validate/client/user.validate");
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", authValidate.register, controller.registerPost);
router.post("/login", authValidate.login, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/forgot-password", controller.forgot);
router.post("/forgot-password", authValidate.forgot, controller.forgotPost);
router.get("/forgot-password/otp", controller.getOtp);
router.post("/forgot-password/otp", controller.getOtpPost);
router.get("/reset-passowrd", controller.resetPassword);
router.post("/reset-password", controller.resetPasswordPost);

module.exports = router;