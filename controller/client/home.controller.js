const Product = require("../../model/product.model");
const Category = require("../../model/category.model");

const newPriceHelper = require("../../helper/newPrice.helper");
const createTree = require("../../helper/createTree.helper");
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
    const category = await Category.find({
        deleted: false,
        status: "active"
    });
    const newCategory = createTree.createTree(category, "");
    res.render("client/page/home/index", {
        titlePage: "Đồ công nghệ",
        productFeatured: newProductFeatured,
        productNew: newProductNew,
        category: newCategory
    });
}
