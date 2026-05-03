const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/checkout.controller");
router.get("/", controller.index);
router.post("/payment", controller.payment);
router.get("/payment/return", controller.return);
router.post("/payment/notify", controller.notify);
router.get("/success/:order_id", controller.success);
module.exports = router;