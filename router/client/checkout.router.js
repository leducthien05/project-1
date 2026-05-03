const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/checkout.controller");
router.get("/", controller.index);
router.post("/payment", controller.payment);
router.get("/payment-momo/return", controller.return);
router.post("/payment-momo/notify", controller.notify);
router.get("/payment-vnpay", controller.vnpay);
router.get("/success/:id", controller.success);
module.exports = router;