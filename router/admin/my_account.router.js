const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middleware/admin//uploadImage");
const validate = require("../../validate/admin/validate");

const controller = require("../../controller/admin/my-account.controller");

router.get("/", controller.index);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit",
    upload.single("avatar"),
    uploadCloud.uploadCloudinary,
    validate.editAccount,
    controller.editPatch
)

module.exports = router;