const homeRouter = require("../client/home.router");

const categoryMiddleware = require("../../middleware/client/category.middleware");

module.exports = (app)=>{
    app.use(categoryMiddleware.category);
    app.use("/", homeRouter);
}