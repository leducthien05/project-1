const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const uploadMiddleware = require("../../middleware/admin/uploadImage");
const validate = require("../../validate/admin/product.validate");
const controller = require("../../controller/admin/product.controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("image"),
    uploadMiddleware.uploadCloudinary,
    validate.create,
    controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single("image"),
    uploadMiddleware.uploadCloudinary,
    validate.create, 
    controller.editPatch
);
router.get("/detail/:id", controller.detail);
module.exports = router;