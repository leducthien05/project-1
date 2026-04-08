const homeRouter = require("./home.router");
const productRouter = require("./product.router");
const searchRouter = require("./search.router");

const categoryMiddleware = require("../../middleware/client/category.middleware");
const brandMiddleware = require("../../middleware/client/brandcount.middleware");

module.exports = (app)=>{
    app.use(categoryMiddleware.category);
    app.use(brandMiddleware.brand);
    app.use("/", homeRouter);
    app.use("/product", productRouter);
    app.use("/search", searchRouter);
}