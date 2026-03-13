const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/product.controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
module.exports = router;