const homeRouter = require("../client/home.router");
const productRouter = require("../client/product.router");


const categoryMiddleware = require("../../middleware/client/category.middleware");

module.exports = (app)=>{
    app.use(categoryMiddleware.category);
    app.use("/", homeRouter);
    app.use("/product", productRouter);
}