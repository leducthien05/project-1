//Cấu hình Express
const express = require("express");
const app = express();
//Mongoose
const mongoose = require("mongoose");
//Port 
require('dotenv').config();
const port = process.env.PORT;
//Connect DB
const connectDB = require("./config/database");
connectDB.connect();
//Method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//body-parse
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
//Cấu hình PUG 
app.set("views", "./view");
app.set("view engine", 'pug'); 
//Biến local
const systemPrefix = require("./config/system");
app.locals.prefixAdmin = systemPrefix.prefixAdmin; 
//Cấu hình file tĩnh
app.use(express.static(`${__dirname}/public/`));
//Cấu hình router
const router = require("./router/admin/index.router");
// const routerClient = require("./router/client/index.router")
//Gọi hàm sử dụng router
router(app);
//Lắng nghe port
app.listen(port, ()=>{
    console.log(`Server chạy ở ${port}`);
});