const Product = require("../../model/product.model");

const helprPriceNew = require("../../helper/newPrice.helper");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");

//[GET] /admin/products
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    }
    //Lọc sản phẩm theo status
    const listStatus = filterStatus.filter(req.query);
    if(req.query.status){
        find.status= req.query.status;
    }
    //Tìm kiếm sản phẩm
    const objectKeyword = search.search(req.query);
    if(req.query.keyword){
        find.name = objectKeyword.regex;
    }
    //Phân trang
    const objectPage = await pagination.pagination(req.query, find);
    const product = await Product.find(find).limit(objectPage.limit).skip(objectPage.skipProduct);
    const newProduct = helprPriceNew.newPriceArray(product);
    res.render("admin/page/product/index", {
        titlePage: "Sản phẩm",
        product: newProduct,
        listStatus: listStatus,
        keyword: objectKeyword.keyword,
        pagination: objectPage
    });
}