const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controller/admin/account.controller");
const validate = require("../../validate/admin/validate");
const uploadImage = require("../../middleware/admin/uploadImage");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", 
    upload.single("avatar"),
    uploadImage.uploadCloudinary,
    validate.createAccount,
    controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single("avatar"),
    uploadImage.uploadCloudinary,
    validate.editAccount,
    controller.editPatch
);
router.delete("/delete/:id", controller.delete);
router.get("/detail/:id", controller.detail);

module.exports = router;