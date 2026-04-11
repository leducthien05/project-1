const Product = require("../../model/product.model");
const Category = require("../../model/category.model");
const Brand = require("../../model/brand.model");

const priceNewHelper = require("../../helper/newPrice.helper");
const paginationHelper = require("../../helper/pagination.helper");
const subCategoryHelper = require("../../helper/subCategory.helper");
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
    const brandMap ={};
    brand.forEach(item=>{
        brandMap[item._id] = item.title;
    });
    newProduct.forEach(item =>{
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
        item.newPrice = item.newPrice.toLocaleString('vi-VN') + ' ₫';
        item.titleBrand = brandMap[item.brand_id];
    });
    res.render("client/page/product/index", {
        titlePage: "Cửa hàng",
        product: newProduct,
        pagination: paginationPage
    });
}
// [GET] /product/detail/:id
module.exports.detail = async (req, res)=>{
    const id = req.params.slug.split("-").pop();
    const product = await Product.findOne({
        _id: id
    });
    if(product.brand_id){
        
    }
    const brand = await Brand.findOne({
        id: product.brand_id,
        deleted: false,
        status: "active"
    }).select("title");
    const newProduct = priceNewHelper.newPrice(product);
    newProduct.price = newProduct.price.toLocaleString('vi-VN') + ' ₫';
    newProduct.newPrice = newProduct.newPrice.toLocaleString('vi-VN') + ' ₫';
    if(brand){
        newProduct.brand = brand.title;
    }
    res.render("client/page/product/detail", {
        titlePage: product.name,
        product: newProduct
    });
}
// [GET] /product/category/:slug
module.exports.category = async (req, res)=>{
    const slug = req.params.slug;
    const category = await Category.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });
    const arrCategory = await subCategoryHelper.subCategory(category._id);
    const idCategory = arrCategory.map(item => item._id);
    const product = await Product.find({
        category_id: {$in: [category._id, ...idCategory]},
        status: "active",
        deleted: false
    });
    const newProduct = priceNewHelper.newPriceArray(product);
    //Thương hiệu
    const brand = await Brand.find({
        deleted: false
    }).select("title slug");
    const brandMap ={};
    brand.forEach(item=>{
        brandMap[item._id] = item.title;
    });
    newProduct.forEach(item =>{
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
        item.newPrice = item.newPrice.toLocaleString('vi-VN') + ' ₫';
        item.titleBrand = brandMap[item.brand_id];
    });
    res.render("client/page/product/list_by_category_brand", {
        titlePage: category.name,
        product: product
    });
}
// [GET] /product/category/:slug
module.exports.brand = async (req, res)=>{
    const slug = req.params.slug;
    const brand = await Brand.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });
    const product = await Product.find({
        brand_id: brand._id,
        status: "active",
        deleted: false
    });
    const newProduct = priceNewHelper.newPriceArray(product);
    newProduct.forEach(item =>{
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
        item.newPrice = item.newPrice.toLocaleString('vi-VN') + ' ₫';
        item.titleBrand = brand.title
    });
    res.render("client/page/product/list_by_category_brand", {
        titlePage: brand.title,
        product: newProduct
    });
}