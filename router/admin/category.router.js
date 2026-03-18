const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controller/admin/category.controller");
const validate = require("../../validate/admin/product.validate");
const uploadImage = require("../../middleware/admin/uploadImage");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
    upload.single("image"),
    uploadImage.uploadCloudinary,
    validate.createCategory,
    controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.get("/detail/:id", controller.detail);
module.exports = router;