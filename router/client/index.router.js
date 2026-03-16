const homeRouter = require("../client/home.router");
module.exports = (app)=>{
    app.use("/", dashboardRouter);
}