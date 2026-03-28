const Category = require("../../model/category.model");

module.exports.category = async (req, res, next)=>{
    const category = await Category.find({
        deleted: false,
        status: "active"
    });
    if(category){
        res.locals.category = category;
        next();
    }
} 