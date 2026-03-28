const Product = require("../../model/product.model");

//[GET] /
module.exports.index = async (req, res)=>{
    res.render("client/page/home/index", {
        titlePage: "Đồ công nghệ"
    });
}
