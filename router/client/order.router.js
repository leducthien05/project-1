const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/order.controller");
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.delete("/cacel/:id", controller.cacel);
module.exports = router;