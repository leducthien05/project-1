const Category = require("../../model/category.model");
const categoryHelper = require("../../helper/createTree.helper");

module.exports.category = async (req, res, next)=>{
    const category = await Category.find({
        deleted: false,
        status: "active"
    });
    if(category){
        const newCategory = categoryHelper.createTree(category, "");
        res.locals.category = newCategory;
        next();
    }
} 