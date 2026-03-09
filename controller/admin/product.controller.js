const Product = require("../../model/product.model");

const helprPriceNew = require("../../helper/newPrice.helper");

//[GET] /admin/products
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    }
    const product = await Product.find(find);
    const newProduct = helprPriceNew.newPriceArray(product);
    res.render("admin/page/product/index", {
        titlePage: "Sản phẩm",
        product: newProduct
    });
}