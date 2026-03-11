const Product = require("../model/product.model");

module.exports.pagination = async (query, find)=>{
    const objectPage = {
        limit: 4,
        currentPage: 1
    }
    const countProduct = await Product.countDocuments(find);
    objectPage.totalPage = Math.ceil(countProduct / objectPage.limit);
    if(query.page){
        objectPage.currentPage = parseInt(query.page);
        const skipProduct = (objectPage.currentPage - 1) * objectPage.limit;
        objectPage.skipProduct = skipProduct;
    }
    return objectPage;
}