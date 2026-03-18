const Product = require("../../model/product.model");

const helprPriceNew = require("../../helper/newPrice.helper");
const filterStatus = require("../../helper/filterStatus.helper");
const search = require("../../helper/search.helper");
const pagination = require("../../helper/pagination.helper");
const prefixAdmin = require("../../config/system");
const filterCriteria = require("../../helper/criteria.helper");

//[GET] /admin/products
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    }
    //Lọc sản phẩm theo status
    const listStatus = filterStatus.filter(req.query);
    if(req.query.status){
        if(req.query.status == "deleted"){
            find.deleted = true;
        }else{
            find.status= req.query.status;
        }
    }
    //Tìm kiếm sản phẩm
    const objectKeyword = search.search(req.query);
    if(req.query.keyword){
        find.name = objectKeyword.regex;
    }
    //Phân trang
    const countProduct = await Product.countDocuments(find);
    const objectPage = await pagination.pagination(req.query, find, countProduct);
    //Lọc theo tiêu chí
    const sort = filterCriteria.criteria(req.query);
    const product = await Product.find(find).limit(objectPage.limit).sort(sort).skip(objectPage.skipRecord);
    const newProduct = helprPriceNew.newPriceArray(product);
    newProduct.forEach((item, index) => {
        item.indexProduct = index + 1 + objectPage.skipProduct;
        if(item.image){
            item.image = item.image + "?w=300&auto=format&fit=crop";
        }
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
    req.flash("success", "Thay đổi trạng thái thành công");
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
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "inactive":
                await Product.updateMany({
                    _id: ids
                }, {status: status});
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete":
                await Product.updateMany({
                    _id: ids
                }, {deleted: true});
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "delete-hard":
                await Product.deleteMany({
                    _id: ids
                });
                req.flash("success", `Xóa hoàn toàn thành công ${ids.length} sản phẩm`);
                break;
            case "un-delete":
                await Product.updateMany({
                    _id: ids
                }, {deleted: false});
                req.flash("success", `Thay đổi thành công ${ids.length} sản phẩm`);
                break;
            case "position":
                for(item of ids){
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateOne({
                        _id: id
                    }, {position: position});
                }
                req.flash("success", `Thay đổi thành công vị trí của ${ids.lenght}`);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(req.get("referer") || "/");
}

// [DELETE] admin/products/delete/:id
module.exports.delete = async (req, res)=>{
    const id = req.params.id;
    // await Product.deleteOne({
    //     _id: id
    // });
    await Product.updateOne({
        _id: id
    }, {deleted: true});
    req.flash("success", `Xóa thành công sản phẩm`);
    res.redirect(req.get("referer") || "/");
}

//[GET] /admin/products/create
module.exports.create = async (req, res)=>{
    res.render("admin/page/product/create", {
        titlePage: "Thêm sản phẩm"
    })
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res)=>{
    
    const product = new Product(req.body);
    await product.save();
    res.redirect("/admin/products");
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res)=>{
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id
    });
    res.render("admin/page/product/edit", {
        titlePage: "Chỉnh sửa sản phẩm",
        product: product
    });
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id;
    console.log(req.body);
    try {
        await Product.updateOne({
            _id: id
        }, req.body);
    } catch (error) {
        console.log(error)
    }
    req.flash("success", "Chỉnh sửa sản phẩm thành công");
    res.redirect(`${prefixAdmin.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res)=>{
    const id = req.params.id;
    const product = await Product.findOne({
        deleted: false
    });
    res.render("admin/page/product/detail", {
        titlePage: product.name,
        product: product
    });
}