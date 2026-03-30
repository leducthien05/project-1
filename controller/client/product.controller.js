const Product = require("../../model/product.model");

const priceNewHelper = require("../../helper/newPrice.helper");

//[GET] /product
module.exports.index = async (req, res)=>{
    const product = await Product.find({
        deleted: false,
        status: "active",
    });
    const newProduct = priceNewHelper.newPriceArray(product);
    res.render("client/page/product/index", {
        titlePage: "Cửa hàng",
        newProduct: newProduct
    })
}