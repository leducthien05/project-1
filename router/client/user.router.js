const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/user.controller");
const authValidate = require("../../validate/client/user.validate");
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", authValidate.register, controller.registerPost);
router.post("/login", authValidate.login, controller.loginPost);
router.get("/logout", controller.logout);
module.exports = router;