const expresss = require("express");
const router = expresss.Router();

const controller = require("../../controller/admin/role.controller");

router.get("/", controller.index);
router.patch("/change-multi-status", controller.changeMulti);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.get("/permissions", controller.permission);
router.patch("/permissions", controller.permissionPatch);
router.get("/detail/:id", controller.detail);

module.exports = router;