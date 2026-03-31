const Product = require("../../model/product.model");
const Category = require("../../model/category.model");
const Brand = require("../../model/brand.model");

const priceNewHelper = require("../../helper/newPrice.helper");
const paginationHelper = require("../../helper/pagination.helper");
const searchHelper = require("../../helper/search.helper");

//[GET] /product
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    };
    //Phân trang
    const count = await Product.countDocuments(find);
    const paginationPage = paginationHelper.pagination(req.query, count);
    const product = await Product.find(find).limit(paginationPage.limit).skip(paginationPage.skipRecord);
    const newProduct = priceNewHelper.newPriceArray(product);

    // const idBrand = newProduct.filter(item => item.brand_id != "").map(item => {
    //     return item.brand_id;
    // });
    // const newIdBrand = [...new Set(idBrand)];//Xóa trùng id
    // const brand = await Brand.find({
    //     _id: { $in: newIdBrand }
    // }).select("title");
    // const brandMap = [];
    // brand.forEach(item => {
    //     const br = {
    //         id: item.id,
    //         title: item.title
    //     }
    //     brandMap.push(br);
    // });
    // const objBrand = {};
    // newIdBrand.forEach((item, index) => {
    //     let count = 0;
    //     newProduct.forEach(product => {
    //         if(product.brand_id == item){
    //             count++;
    //         }
    //     });
    //     objBrand[item] = count;
    //     count = 0;
    // })
    // brandMap.forEach(item=>{
    //     item.totleProduct = objBrand[item.id];
    // });
    // console.log(brandMap);
    const brand = await Brand.find({
        deleted: false
    }).select("title");
    for (const item of brand) {
        const count = await Product.countDocuments({
            deleted: false,
            brand_id: item._id
        });
        item.countProduct = count;
    }
    const brandMap ={};
    brand.forEach(item=>{
        brandMap[item.id] = item.title;
    });
    newProduct.forEach(item =>{
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
        item.newPrice = item.newPrice.toLocaleString('vi-VN') + ' ₫';
        item.titleBrand = brandMap[item.brand_id];
    });
    res.render("client/page/product/index", {
        titlePage: "Cửa hàng",
        product: newProduct,
        brand: brand,
        pagination: paginationPage
    });
}