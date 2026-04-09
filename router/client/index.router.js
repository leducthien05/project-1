const homeRouter = require("./home.router");
const productRouter = require("./product.router");
const searchRouter = require("./search.router");
const cartRouter = require("./cart.router");

const categoryMiddleware = require("../../middleware/client/category.middleware");
const brandMiddleware = require("../../middleware/client/brandcount.middleware");
const cartMiddelware = require("../../middleware/client/cart.middleware");

module.exports = (app)=>{
    app.use(categoryMiddleware.category);
    app.use(brandMiddleware.brand);
    app.use(cartMiddelware.cart);
    app.use("/", homeRouter);
    app.use("/product", productRouter);
    app.use("/search", searchRouter);
    app.use("/cart", cartRouter);
}