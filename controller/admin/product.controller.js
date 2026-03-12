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
    newProduct.forEach((item, index) => {
        item.indexProduct = index + 1 + objectPage.skipProduct;
    });
    
    res.render("admin/page/product/index", {
        titlePage: "Sản phẩm",
        product: newProduct,
        listStatus: listStatus,
        keyword: objectKeyword.keyword,
        pagination: objectPage
    });
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res)=>{
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne({
        _id: id
    }, {status: status});
    res.redirect(req.get("referer") || "/");
}

//[PATCH] /admin/products/change-multi-status
module.exports.changeMulti = async (req, res)=>{
    const ids = req.body.ids.split(", ");
    const status = req.body.status;
    
    try {
        switch (status) {
            case "active":
                await Product.updateMany({
                    _id: ids
                }, {status: status});
                break;
            case "inactive":
                await Product.updateMany({
                    _id: ids
                }, {status: status});
                break;
            case "delete":
                await Product.updateMany({
                    _id: ids
                }, {deleted: true});
                break;
            case "position":
                for(item of ids){
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateOne({
                        _id: id
                    }, {position: position});
                }
                
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}