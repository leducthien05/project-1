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
app.set("views", `${__dirname}/view`);
app.set("view engine", 'pug'); 
//Biến local
const systemPrefix = require("./config/system");
app.locals.prefixAdmin = systemPrefix.prefixAdmin; 
//Cấu hình file tĩnh
app.use(express.static(`${__dirname}/public/`));
//Cấu hình cookie-parse
const cookieParser = require('cookie-parser');
app.use(cookieParser('Thienle'));
// Session
const session = require('express-session');
app.use(session({
    secret: 'Thienle',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,  // local dùng HTTP nên phải để false
        maxAge: 60000
    }
}));
// TinyMCE
const path = require('path');
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//Cấu hình express-flash
const flash = require('express-flash');
app.use(flash());;
//Cấu hình router
const router = require("./router/admin/index.router");
const routerClient = require("./router/client/index.router");
// const routerClient = require("./router/client/index.router")
//Gọi hàm sử dụng router
routerClient(app);
router(app);
//Lắng nghe port
app.listen(port, ()=>{
    console.log(`Server chạy ở ${port}`);
});