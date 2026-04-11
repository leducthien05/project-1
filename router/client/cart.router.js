const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/cart.controller");
router.post("/add/:id", controller.add);
router.get("/", controller.index);
router.delete("/delete/:id", controller.delete)
module.exports = router;