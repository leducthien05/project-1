const Category = require("../../model/category.model");
const Brand = require("../../model/brand.model");
const categoryHelper = require("../../helper/createTree.helper");

module.exports.category = async (req, res, next)=>{
    const category = await Category.find({
        deleted: false,
        status: "active"
    });
    if(category.length > 0){
        const newCategory = categoryHelper.createTree(category, "");
        res.locals.category = newCategory;
    }
    const brand = await Brand.find({
        deleted: false
    }).select("title slug");
    if(brand.length > 0){
        res.locals.brand = brand;
    } 
    next();
} 