const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const uploadMiddleware = require("../../middleware/admin/uploadImage");
const controller = require("../../controller/admin/product.controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/create", controller.create);
router.post(
    "/create",
    uploadMiddleware.uploadStorage().single("image"),
    controller.createPost
);
module.exports = router;