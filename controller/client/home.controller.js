const Product = require("../../model/product.model");

const newPriceHelper = require("../../helper/newPrice.helper");
//[GET] /
module.exports.index = async (req, res)=>{
    const productFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(4);
    const newProductFeatured = newPriceHelper.newPriceArray(productFeatured);
    const productNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(4);
    const newProductNew = newPriceHelper.newPriceArray(productNew);
    res.render("client/page/home/index", {
        titlePage: "Đồ công nghệ",
        productFeatured: newProductFeatured,
        productNew: newProductNew
    });
}
