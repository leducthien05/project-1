const Product = require("../../model/product.model");

//[GET] /
module.exports.index = async (req, res)=>{
    res.send("OK");
}
