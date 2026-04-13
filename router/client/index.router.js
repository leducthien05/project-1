const homeRouter = require("./home.router");
const productRouter = require("./product.router");
const searchRouter = require("./search.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const userRouter = require("./user.router");

const categoryMiddleware = require("../../middleware/client/category.middleware");
const brandMiddleware = require("../../middleware/client/brandcount.middleware");
const cartMiddelware = require("../../middleware/client/cart.middleware");
const userMiddelware = require("../../middleware/client/user.middleware");

module.exports = (app)=>{
    app.use(categoryMiddleware.category);
    app.use(brandMiddleware.brand);
    app.use(cartMiddelware.cart);
    app.use(userMiddelware.user);
    app.use("/", homeRouter);
    app.use("/product", productRouter);
    app.use("/search", searchRouter);
    app.use("/cart", cartRouter);
    app.use("/checkout", checkoutRouter);
    app.use("/user", userRouter);
}