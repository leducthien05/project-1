const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/product.controller");
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.get("/category/:slug", controller.category);
router.get("/brand/:slug", controller.brand);

module.exports = router;