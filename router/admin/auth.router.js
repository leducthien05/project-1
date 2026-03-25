const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/auth.controller");
const validate = require("../../validate/admin/validate");

router.get("/login", controller.login);
router.post("/login", validate.login, controller.loginPost);
router.get("/logout", controller.logout);

module.exports = router;