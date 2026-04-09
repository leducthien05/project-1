const Product = require("../../model/product.model");
const Category = require("../../model/category.model");
const Brand = require("../../model/brand.model");

const newPriceHelper = require("../../helper/newPrice.helper");
const subCategory = require("../../helper/subCategory.helper");
const searchHelper = require("../../helper/search.helper");
//[GET] /
module.exports.index = async (req, res) => {
    let find = {};
    if (req.query.keyword) {
        const search = searchHelper.search(req.query);
        const regex = search.regex
        find = {
            deleted: false,
            status: "active",
            $or: [
                { name: regex },
                { slug: regex }
            ]
        }
    }
    const product = await Product.find(find);
    const newProduct = newPriceHelper.newPriceArray(product);
    const brand = await Brand.find({
        deleted: false
    }).select("title");
    const brandMap = {};
    brand.forEach(item => {
        brandMap[item.id] = item.title;
    });
    newProduct.forEach(item => {
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
        item.newPrice = item.newPrice.toLocaleString('vi-VN') + ' ₫';
        item.titleBrand = brandMap[item.brand_id];
    });
    res.render("client/page/search/index", {
        titlePage: req.query.keyword,
        productNew: newProduct,
        keyword: req.query.keyword
    });
    // res.send("OK")
}
