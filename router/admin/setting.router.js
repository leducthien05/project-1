const expresss = require("express");
const router = expresss.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controller/admin/setting.controller");
const validate = require("../../validate/admin/validate");
const uploadImage = require("../../middleware/admin/uploadImage");

router.get("/", controller.index);
// router.patch("/change-multi-status", controller.changeMulti);
router.patch("/",
    upload.single("logo"),
    validate.setting,
    uploadImage.uploadCloudinary,
    controller.create
);

module.exports = router;