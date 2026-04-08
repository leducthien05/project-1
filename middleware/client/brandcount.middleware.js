const Product = require("../../model/product.model");
const Brand = require("../../model/brand.model");

module.exports.brand = async (req, res, next) => {
    const brand = await Brand.find({
        deleted: false
    }).select("title slug");
    if (brand.length > 0) {
        for (const item of brand) {
            const count = await Product.countDocuments({
                deleted: false,
                brand_id: item._id
            });
            item.countProduct = count;
        }
        res.locals.brandCount = brand;
    }
    next();
} 