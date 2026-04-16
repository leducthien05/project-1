const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controller/client/user.controller");
const authValidate  = require("../../validate/client/user.validate");
const uploadImage = require("../../middleware/admin/uploadImage");
const { validate } = require("../../model/user.model");
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
router.post("/reset-password", authValidate.resetPassword, controller.resetPasswordPost);
router.get("/info", controller.info);
router.get("/edit", controller.edit);
router.post("/edit",
    upload.single("avatar"),
    authValidate.editInfo,
    uploadImage.uploadCloudinary,
    controller.editPatch
);
router.get("/change-password", controller.changePassword);
router.post("/change-password",authValidate.changePassword, controller.changePasswordPost);


module.exports = router;