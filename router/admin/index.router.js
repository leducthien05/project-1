const systemConfig = require("../../config/system");
const authMiddleware = require("../../middleware/admin/auth.middleware");

const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");
const categoryRouter = require("./category.router");
const orderRouter = require("./order.router");
const roleRouter = require("./role.router");
const accountRouter = require("./account.router");
const authRouter = require("./auth.router");
const myAccountRouter = require("./my_account.router");
const brandRouter = require("./brand.router");
const userRouter = require("./user.router");
const settingRouter = require("./setting.router");

module.exports = (app)=>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.authLogin, dashboardRouter);
    app.use(PATH_ADMIN + "/products", authMiddleware.authLogin, productRouter);
    app.use(PATH_ADMIN + "/categorys", authMiddleware.authLogin, categoryRouter);
    app.use(PATH_ADMIN + "/orders", authMiddleware.authLogin, orderRouter);
    app.use(PATH_ADMIN + "/roles", authMiddleware.authLogin, roleRouter);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.authLogin, accountRouter);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.authLogin, myAccountRouter);
    app.use(PATH_ADMIN + "/brands", authMiddleware.authLogin, brandRouter);
    app.use(PATH_ADMIN + "/users", authMiddleware.authLogin, userRouter);
    app.use(PATH_ADMIN + "/settinggeneral", authMiddleware.authLogin, settingRouter);
    app.use(PATH_ADMIN + "/auth", authRouter);
}